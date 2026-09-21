<template>
  <section class="mx-auto max-w-6xl px-4 py-10 text-white">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold">Open Models</h1>

        <p class="mt-3 text-lg text-slate-300">
          Choose which AI backend you want to use. Each provider has separate saved chats.
        </p>
      </div>

      <button
        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        @click="refresh()"
      >
        Refresh status
      </button>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-2">
      <button
        v-for="model in models"
        :key="model.id"
        class="group relative overflow-hidden rounded-3xl border p-8 text-left transition-all duration-300"
        :class="cardClass(model)"
        :disabled="!model.available"
        @click="openModel(model.id)"
      >
        <div
          class="absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-bold"
          :class="model.available
            ? 'border border-green-400/50 bg-green-500/10 text-green-300'
            : 'border border-red-400/50 bg-red-500/10 text-red-300'"
        >
          {{ model.available ? 'ACTIVE' : 'INACTIVE' }}
        </div>

        <div
          class="absolute inset-0 transition duration-300"
          :class="model.available ? model.hoverOverlay : 'bg-slate-950/40'"
        ></div>

        <div class="relative z-10 flex items-center gap-5">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300"
            :class="model.available ? model.iconActiveClass : 'bg-slate-950 opacity-40'"
          >
            <img
              :src="model.icon"
              :alt="model.name"
              class="h-12 w-12 transition-all duration-300"
              :class="model.available ? 'group-hover:scale-110' : 'grayscale opacity-50'"
            />
          </div>

          <div>
            <div class="flex items-center gap-3">
              <h2
                class="text-3xl font-bold"
                :class="model.available ? 'text-white' : 'text-slate-500'"
              >
                {{ model.name }}
              </h2>

              <span
                v-if="model.available"
                class="translate-x-[-12px] text-xl font-semibold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                :class="model.accentText"
              >
                {{ model.short }}
              </span>
            </div>

            <p
              class="mt-3 text-lg"
              :class="model.available ? 'text-slate-300' : 'text-slate-500'"
            >
              {{ model.description }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                class="inline-block rounded-full border px-3 py-1 text-sm"
                :class="model.available ? model.badgeClass : 'border-slate-700 text-slate-500'"
              >
                {{ model.badge }}
              </span>

              <span
                class="inline-block rounded-full border px-3 py-1 text-sm"
                :class="model.available
                  ? 'border-green-400/40 text-green-300'
                  : 'border-red-400/40 text-red-300'"
              >
                {{ model.statusText }}
              </span>
            </div>

            <p
              class="mt-3 text-sm"
              :class="model.available ? 'text-slate-400' : 'text-red-300'"
            >
              {{ model.reason }}
            </p>
          </div>
        </div>
      </button>
    </div>

    <p
      v-if="pending"
      class="mt-6 text-sm text-slate-400"
    >
      Checking model availability...
    </p>
  </section>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()

const { data: status, pending, refresh } = await useFetch('/api/models/status')

const models = computed(() => {
  const ollamaStatus = status.value?.ollama || {}
  const openaiStatus = status.value?.openai || {}

  return [
    {
      id: 'ollama',
      name: 'Ollama',
      short: 'local',
      icon: '/icons/ollama.svg',
      description: 'Runs a local model on your machine or VM.',
      badge: 'Local inference',
      available: Boolean(ollamaStatus.available),
      statusText: ollamaStatus.available ? 'Ready to use' : 'Not available',
      reason: ollamaStatus.reason || 'Checking Ollama...',
      accentText: 'text-cyan-300',
      badgeClass: 'border-cyan-400/40 text-cyan-300',
      iconActiveClass: 'bg-slate-950 group-hover:bg-cyan-500/20',
      hoverOverlay: 'bg-cyan-500/0 group-hover:bg-cyan-500/10',
      activeCardClass:
        'border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      short: 'API',
      icon: '/icons/openai.svg',
      description: 'Uses a cloud model through the OpenAI API.',
      badge: 'Cloud inference',
      available: Boolean(openaiStatus.available),
      statusText: openaiStatus.available ? 'Ready to use' : 'Not available',
      reason: openaiStatus.reason || 'Checking OpenAI...',
      accentText: 'text-emerald-300',
      badgeClass: 'border-emerald-400/40 text-emerald-300',
      iconActiveClass: 'bg-slate-950 group-hover:bg-emerald-500/20',
      hoverOverlay: 'bg-emerald-500/0 group-hover:bg-emerald-500/10',
      activeCardClass:
        'border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]'
    }
  ]
})

function cardClass(model) {
  if (!model.available) {
    return 'cursor-not-allowed border-slate-800 bg-slate-900/50 opacity-70'
  }

  return model.activeCardClass
}

function openModel(provider) {
  const model = models.value.find(m => m.id === provider)

  if (!model?.available) return

  router.push(`/chat/${provider}`)
}
</script>
