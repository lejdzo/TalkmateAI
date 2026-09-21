import bcrypt from 'bcryptjs'
import { getDb } from '../../utils/db'
import { createToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '').toLowerCase().trim()
  const password = String(body.password || '')

  const db = await getDb()
  const userDoc = await db.collection('users').findOne({ email })
  if (!userDoc) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, userDoc.passwordHash)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const user = { id: userDoc._id.toString(), email: userDoc.email }
  return { token: createToken(user), user }
})
