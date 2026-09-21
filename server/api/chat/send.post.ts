import { ObjectId } from 'mongodb'
import OpenAI from 'openai'
import { getDb } from '../../utils/db'
import { requireUser } from '../../utils/auth'

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

async function callOpenAI(messages: ChatMessage[]) {
  const config = useRuntimeConfig()
  if (!config.openaiApiKey) throw createError({ statusCode: 500, statusMessage: 'OPENAI_API_KEY is not configured' })
  const client = new OpenAI({ apiKey: config.openaiApiKey })
  const response = await client.chat.completions.create({
    model: config.openaiModel,
    messages
  })
  return response.choices[0]?.message?.content || ''
}

async function callOllama(messages: ChatMessage[]) {
  const config = useRuntimeConfig()
  const response = await fetch(`${config.ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.ollamaModel,
      messages,
      stream: false
    })
  })
  if (!response.ok) throw createError({ statusCode: 502, statusMessage: 'Ollama request failed. Check if Ollama is running.' })
  const data = await response.json()
  return data.message?.content || ''
}

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const provider = String(body.provider || 'ollama')
  const content = String(body.message || '').trim()
  const conversationId = body.conversationId ? String(body.conversationId) : ''

  if (!['ollama', 'openai'].includes(provider)) throw createError({ statusCode: 400, statusMessage: 'Provider must be ollama or openai' })
  if (!content) throw createError({ statusCode: 400, statusMessage: 'Message is required' })

  const config = useRuntimeConfig()
  const modelName = provider === 'openai' ? config.openaiModel : config.ollamaModel
  const db = await getDb()

  let conv: any = null
  let convId = conversationId

  if (convId) {
    if (!ObjectId.isValid(convId)) throw createError({ statusCode: 400, statusMessage: 'Invalid conversationId' })
    conv = await db.collection('conversations').findOne({ _id: new ObjectId(convId), userId: user.id, provider })
    if (!conv) throw createError({ statusCode: 404, statusMessage: 'Conversation not found for this provider' })
  } else {
    const result = await db.collection('conversations').insertOne({
      userId: user.id,
      provider,
      modelName,
      title: content.slice(0, 60),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    convId = result.insertedId.toString()
  }

  await db.collection('messages').insertOne({ conversationId: convId, role: 'user', content, provider, modelName, createdAt: new Date() })

  const previous = await db.collection('messages')
    .find({ conversationId: convId })
    .sort({ createdAt: 1 })
    .limit(20)
    .toArray()

  const system: ChatMessage = {
    role: 'system',
    content: 'You are a helpful dialogue-system assistant. Answer clearly and concisely.'
  }
  const messages: ChatMessage[] = [system, ...previous.map((m: any) => ({ role: m.role, content: m.content }))]

  const answer = provider === 'openai' ? await callOpenAI(messages) : await callOllama(messages)

  await db.collection('messages').insertOne({ conversationId: convId, role: 'assistant', content: answer, provider, modelName, createdAt: new Date() })
  await db.collection('conversations').updateOne({ _id: new ObjectId(convId) }, { $set: { updatedAt: new Date(), modelName } })

  return { conversationId: convId, provider, modelName, answer }
})
