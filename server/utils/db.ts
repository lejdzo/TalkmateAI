import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb() {
  if (db) return db
  const config = useRuntimeConfig()
  client = new MongoClient(config.mongodbUri)
  await client.connect()
  db = client.db(config.dbName)
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('conversations').createIndex({ userId: 1, provider: 1 })
  await db.collection('messages').createIndex({ conversationId: 1, createdAt: 1 })
  return db
}
