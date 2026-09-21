# AI Dialogue System

Nuxt 3 project for the topic: **Razvoj sistemov dialoga (umetna inteligenca – AI)**.

It demonstrates two AI integration methods:

1. **Ollama local model** – local AI inference.
2. **OpenAI API model** – cloud/API AI inference.

Users must log in before opening models. Conversations are saved in MongoDB and separated by provider: `ollama` and `openai`.

## Requirements

- Node.js 20+
- MongoDB running locally or remotely
- Optional: Ollama running locally
- Optional: OpenAI API key

## Install

```bash
npm install
cp .env.example .env
```

Edit `.env`.

## Start MongoDB

CentOS example:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

## Start Ollama

```bash
ollama serve
ollama pull llama3.2
```

## Start Nuxt

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Inside VirtualBox NAT, add port forwarding:

- Host 3000 → Guest 3000
- Host 11434 → Guest 11434 only if needed from host, not required for this app if Ollama runs inside VM.

## Project pages

- `/` home
- `/login` login/register
- `/models` protected model selection page
- `/chat/ollama` protected chat with Ollama
- `/chat/openai` protected chat with OpenAI

## REST API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/chat/conversations?provider=ollama|openai`
- `GET /api/chat/messages?conversationId=...`
- `POST /api/chat/send`

## MongoDB collections

- `users`
- `conversations`
- `messages`

## Defense explanation

This project is a web-based dialogue system. It uses Nuxt as the frontend and REST API backend, MongoDB for user and conversation persistence, and two different AI model integration methods. Ollama demonstrates local model execution, while OpenAI demonstrates cloud API model execution. The database is not the AI model; it stores users, chats, and message history.
