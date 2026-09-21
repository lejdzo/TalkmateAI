# Defense notes

## Project title

Development of a dialogue system using local and cloud AI models.

## Main idea

The user logs in, opens the protected model page, selects an AI provider, and chats with the selected model. Previous conversations are saved in MongoDB. When the user switches provider, the application loads only the conversations for that provider.

## Why REST instead of SOAP?

REST is more appropriate for this project because the web frontend and backend exchange JSON over HTTP. Modern AI APIs also use REST/JSON. SOAP is XML-based and more suitable for older enterprise integrations where strict contracts are required. For a web dialogue system, REST is simpler, lighter, and easier to integrate with Nuxt, MongoDB, Ollama, and OpenAI.

## AI usage methods

1. Ollama local model:
   - Runs locally.
   - Better privacy.
   - Can work without cloud AI API.

2. OpenAI API model:
   - Runs in the cloud.
   - Usually higher quality responses.
   - Easier to use without local GPU resources.

## Security

The user must authenticate before accessing `/models` or `/chat/*`. The OpenAI API key is stored only in `.env` on the backend and is never exposed in frontend JavaScript.

## Database role

MongoDB is not an AI model. It stores users, conversations, and messages. It allows the dialogue system to remember previous chats and load them later.
