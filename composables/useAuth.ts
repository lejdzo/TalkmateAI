type AuthUser = { id: string; email: string }

export const useAuth = () => {
  const token = useState<string | null>('token', () => null)
  const user = useState<AuthUser | null>('user', () => null)

  function initAuth() {
    if (!process.client) return

    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    token.value = savedToken

    try {
      user.value = savedUser ? JSON.parse(savedUser) : null
    } catch {
      user.value = null
      localStorage.removeItem('user')
    }
  }

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser

    if (process.client) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    }
  }

  function logout() {
    token.value = null
    user.value = null

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const isLoggedIn = computed(() => Boolean(token.value && user.value))

  return {
    token,
    user,
    isLoggedIn,
    initAuth,
    setAuth,
    logout
  }
}
