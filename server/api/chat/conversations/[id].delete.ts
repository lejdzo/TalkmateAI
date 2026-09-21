import { ObjectId } from 'mongodb'
import { getDb } from '../../../utils/db'
import { requireUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const id = String(event.context.params?.id || '')

  if (!ObjectId.isValid(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid conversation id'
    })
  }

  const db = await getDb()

  const conversation = await db.collection('conversations').findOne({
    _id: new ObjectId(id),
    userId: user.id
  })

  if (!conversation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Conversation not found'
    })
  }

  await db.collection('messages').deleteMany({
    conversationId: id
  })

  await db.collection('conversations').deleteOne({
    _id: new ObjectId(id),
    userId: user.id
  })

  return {
    ok: true
  }
})
