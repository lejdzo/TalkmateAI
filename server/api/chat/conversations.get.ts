import { getDb } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const query = getQuery(event)
  const provider = String(query.provider || '')
  const filter: any = { userId: user.id }
  if (provider) filter.provider = provider

  const db = await getDb()
  const conversations = await db.collection('conversations')
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray()

  return conversations.map(c => ({
    id: c._id.toString(),
    provider: c.provider,
    modelName: c.modelName,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  }))
})
