# TalkMate AI

TalkMate AI is a personal full-stack AI dialogue system built with Nuxt, MongoDB, OpenAI and Ollama.

The application allows users to create an account, log in, select an AI provider and maintain persistent conversations with either a cloud-based OpenAI model or a locally hosted Ollama model.

## Live Demo

http://178.170.13.19:8003

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- OpenAI API integration
- Local Ollama AI integration
- AI provider selection
- Persistent conversation history
- Multiple conversations per user
- Conversation deletion
- MongoDB storage for users, conversations and messages
- REST API backend
- AI provider availability/status checking

## Technologies

### Frontend
- Nuxt
- Vue.js
- JavaScript / TypeScript
- Tailwind CSS

### Backend
- Nuxt Server API
- Node.js
- REST APIs
- MongoDB
- JWT authentication
- bcrypt password hashing

### AI
- OpenAI API
- Ollama
- Local and cloud AI models

## Architecture

The application supports two different AI integration approaches:

**OpenAI**
- Cloud-based AI model
- Requests are sent through the OpenAI API

**Ollama**
- Locally hosted AI model
- AI inference runs on the local/server environment

MongoDB is used to store users, conversations and message history.

## Project Structure

```text
pages/              Application pages and chat interface
composables/        Reusable frontend logic
middleware/         Route authentication
server/api/         REST API endpoints
server/utils/       Authentication and database utilities
assets/             Application styles
public/             Static assets and icons
```
