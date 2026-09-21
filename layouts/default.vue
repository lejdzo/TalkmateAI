<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <!-- Global background for all pages -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div class="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="absolute right-[-120px] top-1/3 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute bottom-[-160px] left-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-3xl"></div>

      <!-- subtle grid only desktop -->
      <div
        class="hidden lg:block absolute inset-0 opacity-[0.035]"
        style="background-image: linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px); background-size: 56px 56px;"
      ></div>
    </div>

    <!-- Navbar -->
    <header class="relative z-20 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <nav class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4">
        <NuxtLink to="/" class="text-xl font-black tracking-tight">
          TalkMate AI
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 sm:block"
          >
            Home
          </NuxtLink>

          <NuxtLink
            to="/models"
            class="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 sm:block"
          >
            Models
          </NuxtLink>

          <template v-if="user">
            <div class="hidden items-center gap-2 rounded-full bg-slate-800 px-3 py-2 sm:flex">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
                <svg class="h-5 w-5 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v1.5c0 .83.67 1.5 1.5 1.5h17c.83 0 1.5-.67 1.5-1.5V19c0-3.33-6.67-5-10-5Z" />
                </svg>
              </div>

              <span class="max-w-[180px] truncate text-sm text-slate-200">
                {{ user.email }}
              </span>
            </div>

            <button
              class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold hover:bg-slate-700"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>

          <NuxtLink
            v-else
            to="/login"
            class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500"
          >
            Login
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Page content -->
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { user, initAuth, logout } = useAuth()

onMounted(() => {
  initAuth()
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>
