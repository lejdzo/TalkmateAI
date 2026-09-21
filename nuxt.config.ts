export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    dbName: process.env.DB_NAME || 'ai_dialog_db',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    ollamaUrl: process.env.OLLAMA_URL || 'http://127.0.0.1:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
    public: {
      appName: 'AI Dialogue System'
    }
  }
})
