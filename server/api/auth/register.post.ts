import bcrypt from 'bcryptjs'
import { getDb } from '../../utils/db'
import { createToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '').toLowerCase().trim()
  const password = String(body.password || '')
  if (!email || password.length < 6) throw createError({ statusCode: 400, statusMessage: 'Email and password with at least 6 characters are required' })

  const db = await getDb()
  const existing = await db.collection('users').findOne({ email })
  if (existing) throw createError({ statusCode: 400, statusMessage: 'User already exists' })

  const passwordHash = await bcrypt.hash(password, 10)
  const result = await db.collection('users').insertOne({ email, passwordHash, createdAt: new Date() })
  const user = { id: result.insertedId.toString(), email }
  return { token: createToken(user), user }
})
