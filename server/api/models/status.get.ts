export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const ollamaUrl = String(config.ollamaUrl || '').replace(/\/$/, '')
  const ollamaModel = String(config.ollamaModel || 'llama3.2')
  const openaiModel = String(config.openaiModel || 'gpt-4o-mini')
  const openaiApiKey = String(config.openaiApiKey || '')

  let ollama = {
    available: false,
    model: ollamaModel,
    reason: 'Ollama is not running'
  }

  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(2000)
    })

    if (response.ok) {
      const data = await response.json()
      const modelNames = Array.isArray(data.models)
        ? data.models.map((m: any) => String(m.name))
        : []

      const modelExists = modelNames.some((name: string) =>
        name === ollamaModel || name.startsWith(`${ollamaModel}:`)
      )

      ollama = modelExists
        ? {
            available: true,
            model: ollamaModel,
            reason: 'Ollama is ready'
          }
        : {
            available: false,
            model: ollamaModel,
            reason: `Ollama is running, but model ${ollamaModel} is not installed`
          }
    }
  } catch {
    ollama = {
      available: false,
      model: ollamaModel,
      reason: 'Ollama is not reachable'
    }
  }

  const openaiAvailable =
    openaiApiKey.length > 10 &&
    !openaiApiKey.includes('change-this') &&
    !openaiApiKey.includes('your-key')

  const openai = {
    available: openaiAvailable,
    model: openaiModel,
    reason: openaiAvailable
      ? 'OpenAI API key is configured'
      : 'OPENAI_API_KEY is missing'
  }

  return {
    ollama,
    openai
  }
})
