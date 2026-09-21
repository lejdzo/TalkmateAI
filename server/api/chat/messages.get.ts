import { ObjectId } from 'mongodb'
import { getDb } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const query = getQuery(event)
  const conversationId = String(query.conversationId || '')
  if (!ObjectId.isValid(conversationId)) throw createError({ statusCode: 400, statusMessage: 'Invalid conversationId' })

  const db = await getDb()
  const conversation = await db.collection('conversations').findOne({ _id: new ObjectId(conversationId), userId: user.id })
  if (!conversation) throw createError({ statusCode: 404, statusMessage: 'Conversation not found' })

  const messages = await db.collection('messages')
    .find({ conversationId })
    .sort({ createdAt: 1 })
    .toArray()

  return messages.map(m => ({
    id: m._id.toString(),
    role: m.role,
    content: m.content,
    provider: m.provider,
    modelName: m.modelName,
    createdAt: m.createdAt
  }))
})
