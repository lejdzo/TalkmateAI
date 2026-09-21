<template>
  <div class="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 mt-10">
    <h1 class="text-2xl font-bold">{{ mode === 'login' ? 'Login' : 'Register' }}</h1>
    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" class="w-full rounded bg-slate-950 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-blue-500" />
      <input v-model="password" type="password" placeholder="Password" class="w-full rounded bg-slate-950 px-4 py-3 outline-none ring-1 ring-slate-700 focus:ring-blue-500" />
      <button class="w-full rounded bg-blue-600 py-3 font-semibold hover:bg-blue-500">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
    </form>
    <p v-if="error" class="mt-4 text-sm text-red-300">{{ error }}</p>
    <button class="mt-4 text-sm text-blue-300" @click="mode = mode === 'login' ? 'register' : 'login'">
      {{ mode === 'login' ? 'Need account? Register' : 'Already have account? Login' }}
    </button>
  </div>
</template>
<script setup lang="ts">
const auth = useAuth()
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')
async function submit() {
  error.value = ''
  try {
    const data: any = await $fetch(`/api/auth/${mode.value}`, { method: 'POST', body: { email: email.value, password: password.value } })
    auth.setAuth(data.token, data.user)
    await navigateTo('/models')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Authentication failed'
  }
}
</script>
