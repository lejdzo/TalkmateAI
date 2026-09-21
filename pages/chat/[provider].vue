<template>
  <div class="mx-auto flex min-h-[calc(100vh-73px)] max-w-[1600px] gap-4 px-4 py-6">
    <!-- Sidebar -->
    <aside class="hidden w-[320px] shrink-0 rounded-3xl border border-slate-800 bg-slate-900/85 p-4 shadow-xl shadow-black/20 backdrop-blur lg:flex lg:flex-col">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-bold">{{ providerLabel }} chats</h2>
          <p class="text-xs text-slate-400">Saved conversation history</p>
        </div>

        <button
          @click="newChat"
          class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500"
        >
          New
        </button>
      </div>

      <div class="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        <div
          v-for="c in conversations"
          :key="c.id"
          class="group relative rounded-2xl transition"
          :class="conversationId === c.id ? 'bg-slate-800 ring-1 ring-blue-500/40' : 'bg-slate-950 hover:bg-slate-800'"
        >
          <button
            class="w-full p-3 pr-10 text-left text-sm"
            @click="selectConversation(c.id)"
          >
            <div class="truncate font-bold">
              {{ c.title || 'Untitled chat' }}
            </div>

            <div class="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{{ c.modelName }}</span>
              <span>{{ formatDate(c.updatedAt) }}</span>
            </div>
          </button>

          <button
            class="absolute right-2 top-2 rounded-lg px-2 py-1 text-xs text-slate-500 opacity-0 transition hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"
            title="Delete chat"
            @click.stop="deleteConversation(c.id)"
          >
            ✕
          </button>
        </div>

        <div
          v-if="conversations.length === 0"
          class="rounded-2xl bg-slate-950 p-4 text-sm text-slate-400"
        >
          No previous chats yet.
        </div>
      </div>
    </aside>

    <!-- Chat area -->
    <section class="flex min-w-0 flex-1 flex-col rounded-3xl border border-slate-800 bg-slate-900/85 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800">
            <img
              v-if="provider === 'openai'"
              src="/icons/openai.svg"
              alt="OpenAI"
              class="h-7 w-7"
            />

            <img
              v-else
              src="/icons/ollama.svg"
              alt="Ollama"
              class="h-7 w-7"
            />
          </div>

          <div class="min-w-0">
            <h1 class="truncate text-xl font-black">
              {{ providerLabel }}
            </h1>

            <p class="truncate text-sm text-slate-400">
              Protected AI dialogue system
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold hover:bg-slate-700 lg:hidden"
            @click="showMobileChats = true"
          >
            Chats
          </button>

          <NuxtLink
            to="/models"
            class="rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Change model
          </NuxtLink>
        </div>
      </div>

      <!-- Messages -->
      <div
        ref="chatBox"
        class="mt-4 min-h-0 flex-1 overflow-y-auto rounded-3xl bg-slate-950/90 p-4"
      >
        <div
          v-if="messages.length === 0 && !loading"
          class="flex h-full min-h-[420px] items-center justify-center text-center text-slate-400"
        >
          <div>
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <img
                v-if="provider === 'openai'"
                src="/icons/openai.svg"
                alt="OpenAI"
                class="h-9 w-9"
              />

              <img
                v-else
                src="/icons/ollama.svg"
                alt="Ollama"
                class="h-9 w-9"
              />
            </div>

            <p class="text-lg font-bold text-slate-300">
              Start a conversation
            </p>

            <p class="mt-1 text-sm">
              Ask something and the answer will be saved in MongoDB.
            </p>
          </div>
        </div>

        <div
          v-for="(m, index) in messages"
          :key="m.id || `${m.role}-${index}`"
          class="mb-5 flex gap-3"
          :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            v-if="m.role !== 'user'"
            class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800"
          >
            <img
              v-if="provider === 'openai'"
              src="/icons/openai.svg"
              alt="OpenAI"
              class="h-5 w-5"
            />

            <img
              v-else
              src="/icons/ollama.svg"
              alt="Ollama"
              class="h-5 w-5"
            />
          </div>

          <div class="max-w-[78%]">
            <div
              class="mb-1 text-xs uppercase text-slate-500"
              :class="m.role === 'user' ? 'text-right' : 'text-left'"
            >
              {{ m.role === 'user' ? 'You' : providerLabel }}
            </div>

            <div
              class="whitespace-pre-wrap break-words rounded-2xl p-3 leading-relaxed"
              :class="m.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-100'"
            >
              {{ m.content }}
            </div>
          </div>

          <div
            v-if="m.role === 'user'"
            class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700"
          >
            <svg class="h-5 w-5 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
            </svg>
          </div>
        </div>

        <div
          v-if="loading"
          class="mb-5 flex gap-3"
        >
          <div class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800">
            <img
              v-if="provider === 'openai'"
              src="/icons/openai.svg"
              alt="OpenAI"
              class="h-5 w-5"
            />

            <img
              v-else
              src="/icons/ollama.svg"
              alt="Ollama"
              class="h-5 w-5"
            />
          </div>

          <div>
            <div class="mb-1 text-xs uppercase text-slate-500">
              {{ providerLabel }}
            </div>

            <div class="rounded-2xl bg-slate-800 p-3 text-slate-300">
              {{ thinkingText }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <form
        class="mt-4 flex shrink-0 gap-2"
        @submit.prevent="send"
      >
        <textarea
          v-model="message"
          rows="1"
          class="max-h-32 flex-1 resize-none rounded-2xl bg-slate-950 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-blue-500"
          placeholder="Write a message..."
          @keydown.enter.exact.prevent="send"
        />

        <button
          :disabled="loading || !message.trim()"
          class="rounded-2xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? 'Thinking...' : 'Send' }}
        </button>
      </form>

      <p
        v-if="error"
        class="mt-3 shrink-0 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300"
      >
        {{ error }}
      </p>
    </section>

    <!-- Mobile chats drawer -->
    <div
      v-if="showMobileChats"
      class="fixed inset-0 z-50 bg-black/60 p-4 lg:hidden"
      @click.self="showMobileChats = false"
    >
      <aside class="h-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">{{ providerLabel }} chats</h2>

          <button
            class="rounded-xl bg-slate-800 px-3 py-2 text-sm"
            @click="showMobileChats = false"
          >
            Close
          </button>
        </div>

        <button
          class="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold"
          @click="newChat(); showMobileChats = false"
        >
          New chat
        </button>

        <div class="mt-4 space-y-2 overflow-y-auto">
          <div
            v-for="c in conversations"
            :key="c.id"
            class="rounded-2xl bg-slate-950 p-3"
          >
            <button
              class="w-full text-left"
              @click="selectConversation(c.id); showMobileChats = false"
            >
              <div class="truncate text-sm font-bold">
                {{ c.title || 'Untitled chat' }}
              </div>

              <div class="mt-1 text-xs text-slate-400">
                {{ c.modelName }} · {{ formatDate(c.updatedAt) }}
              </div>
            </button>

            <button
              class="mt-2 rounded-lg px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
              @click.stop="deleteConversation(c.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

type Conversation = {
  id: string
  title: string
  provider: string
  modelName: string
  createdAt: string
  updatedAt: string
}

type ChatMessage = {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  provider?: string
  modelName?: string
  createdAt?: string
}

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const provider = computed(() => String(route.params.provider || 'openai'))

const providerLabel = computed(() => {
  if (provider.value === 'openai') return 'ChatGPT'
  if (provider.value === 'ollama') return 'Ollama'
  return 'AI Model'
})

const thinkingText = computed(() => {
  if (provider.value === 'openai') return 'OpenAI is thinking...'
  if (provider.value === 'ollama') return 'Ollama is thinking...'
  return 'AI is thinking...'
})

const conversations = ref<Conversation[]>([])
const messages = ref<ChatMessage[]>([])
const conversationId = ref('')
const message = ref('')
const loading = ref(false)
const error = ref('')
const chatBox = ref<HTMLElement | null>(null)
const showMobileChats = ref(false)

onMounted(async () => {
  auth.initAuth()

  if (!['openai', 'ollama'].includes(provider.value)) {
    await router.push('/models')
    return
  }

  await loadConversations()
})

watch(provider, async () => {
  if (!['openai', 'ollama'].includes(provider.value)) {
    await router.push('/models')
    return
  }

  conversationId.value = ''
  messages.value = []
  error.value = ''
  await loadConversations()
})

async function apiFetch<T>(url: string, options: any = {}) {
  try {
    return await $fetch<T>(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${auth.token.value}`
      }
    })
  } catch (e: any) {
    if (e?.status === 401 || e?.statusCode === 401) {
      auth.logout()
      await navigateTo('/login')
    }

    throw e
  }
}

async function loadConversations() {
  error.value = ''

  try {
    conversations.value = await apiFetch<Conversation[]>(
      `/api/chat/conversations?provider=${provider.value}`
    )
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not load conversations'
  }
}

async function selectConversation(id: string) {
  error.value = ''
  conversationId.value = id

  try {
    messages.value = await apiFetch<ChatMessage[]>(
      `/api/chat/messages?conversationId=${id}`
    )

    await scrollToBottom()
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not load messages'
  }
}

function newChat() {
  conversationId.value = ''
  messages.value = []
  error.value = ''
}

async function deleteConversation(id: string) {
  const ok = confirm('Delete this chat?')
  if (!ok) return

  error.value = ''

  try {
    await apiFetch(`/api/chat/conversations/${id}`, {
      method: 'DELETE'
    })

    conversations.value = conversations.value.filter(c => c.id !== id)

    if (conversationId.value === id) {
      newChat()
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not delete chat'
  }
}

async function send() {
  const text = message.value.trim()

  if (!text || loading.value) return

  error.value = ''
  loading.value = true

  messages.value.push({
    role: 'user',
    content: text
  })

  message.value = ''
  await scrollToBottom()

  try {
    const res = await apiFetch<{
      conversationId: string
      provider: string
      modelName: string
      answer: string
    }>('/api/chat/send', {
      method: 'POST',
      body: {
        provider: provider.value,
        conversationId: conversationId.value || undefined,
        message: text
      }
    })

    conversationId.value = res.conversationId

    messages.value.push({
      role: 'assistant',
      content: res.answer,
      provider: res.provider,
      modelName: res.modelName
    })

    await loadConversations()
    await scrollToBottom()
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Sending failed'
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()

  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  }
}

function formatDate(value: string) {
  if (!value) return ''

  try {
    return new Date(value).toLocaleDateString()
  } catch {
    return ''
  }
}
</script>
