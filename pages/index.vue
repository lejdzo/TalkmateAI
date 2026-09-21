<template>
  <main class="min-h-[calc(100vh-73px)] overflow-hidden text-white">

    <section class="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
      <!-- Hero -->
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span class="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            AI Dialogue System
          </span>

          <h1 class="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Chat with local and cloud AI models
          </h1>

          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            TalkMate AI is a web dialogue system where users can log in, choose an AI provider,
            and chat with either a local Ollama model or a cloud OpenAI model.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <NuxtLink
              v-if="user"
              to="/models"
              class="rounded-2xl bg-blue-600 px-6 py-3 font-bold shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Open Models
            </NuxtLink>

            <NuxtLink
              v-else
              to="/login"
              class="rounded-2xl bg-blue-600 px-6 py-3 font-bold shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Login / Register
            </NuxtLink>

            <NuxtLink
              to="/models"
              class="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800"
            >
              View Providers
            </NuxtLink>
          </div>
        </div>

        <!-- Main preview card -->
        <div class="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
          <div class="rounded-[1.5rem] bg-slate-950 p-5">
            <div class="mb-5 flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-red-400"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span class="h-3 w-3 rounded-full bg-green-400"></span>
              <span class="ml-3 text-sm text-slate-400">TalkMate AI chat</span>
            </div>

            <div class="space-y-4">
              <div class="max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-800 p-4">
                <p class="text-sm text-slate-200">
                  Explain the difference between local and cloud AI.
                </p>
              </div>

              <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-blue-600 p-4">
                <p class="text-sm text-white">
                  Local AI runs on your own machine with Ollama. Cloud AI uses an external provider like OpenAI.
                </p>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Architecture
                </p>

                <div class="grid gap-3 text-sm">
                  <div class="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
                    <span>Nuxt frontend</span>
                    <span class="text-blue-300">UI</span>
                  </div>

                  <div class="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
                    <span>REST API</span>
                    <span class="text-cyan-300">Backend</span>
                  </div>

                  <div class="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
                    <span>MongoDB</span>
                    <span class="text-emerald-300">Storage</span>
                  </div>

                  <div class="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
                    <span>Ollama / OpenAI</span>
                    <span class="text-purple-300">AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature cards -->
      <div class="mt-16 grid gap-5 md:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-500/50"
        >
          <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
            {{ feature.icon }}
          </div>

          <h2 class="text-xl font-bold">
            {{ feature.title }}
          </h2>

          <p class="mt-3 leading-7 text-slate-400">
            {{ feature.text }}
          </p>
        </div>
      </div>

      <!-- Workflow -->
      <div class="mt-16 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-bold uppercase tracking-wider text-blue-300">
              Project workflow
            </p>

            <h2 class="mt-2 text-3xl font-black">
              How the system works
            </h2>
          </div>

          <p class="max-w-xl text-slate-400">
            The user authenticates, selects a model provider, sends a message, and the system stores the conversation.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-4">
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="rounded-2xl bg-slate-950 p-5"
          >
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              {{ index + 1 }}
            </div>

            <h3 class="font-bold">
              {{ step.title }}
            </h3>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              {{ step.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom summary -->
      <div class="mt-16 grid gap-5 md:grid-cols-3">
        <div class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <p class="text-3xl font-black text-blue-300">Nuxt</p>
          <p class="mt-2 text-slate-400">Frontend and API routes</p>
        </div>

        <div class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <p class="text-3xl font-black text-emerald-300">MongoDB</p>
          <p class="mt-2 text-slate-400">Users, messages, conversations</p>
        </div>

        <div class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <p class="text-3xl font-black text-cyan-300">AI</p>
          <p class="mt-2 text-slate-400">Ollama local + OpenAI cloud</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { user, initAuth } = useAuth()

onMounted(() => {
  initAuth()
})

const features = [
  {
    icon: '🧠',
    title: 'Two AI providers',
    text: 'The system supports Ollama for local inference and OpenAI for cloud inference.'
  },
  {
    icon: '🔐',
    title: 'Protected access',
    text: 'Users must log in before opening the model selection page and chat pages.'
  },
  {
    icon: '💬',
    title: 'Saved conversations',
    text: 'MongoDB stores users, conversations, and messages so chats can be loaded later.'
  }
]

const steps = [
  {
    title: 'Login',
    text: 'The user signs in and receives access to protected pages.'
  },
  {
    title: 'Choose model',
    text: 'The user selects Ollama or OpenAI from the models page.'
  },
  {
    title: 'Send message',
    text: 'The backend sends the prompt to the selected AI provider.'
  },
  {
    title: 'Save chat',
    text: 'The conversation and response are stored in MongoDB.'
  }
]
</script>
