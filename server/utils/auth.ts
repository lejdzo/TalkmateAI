import jwt from 'jsonwebtoken'

export type JwtUser = { id: string; email: string }

export function createToken(user: JwtUser) {
  const config = useRuntimeConfig()
  return jwt.sign(user, config.jwtSecret, { expiresIn: '7d' })
}

export function requireUser(event: any): JwtUser {
  const config = useRuntimeConfig()
  const header = getHeader(event, 'authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Missing token' })
  try {
    return jwt.verify(token, config.jwtSecret) as JwtUser
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}
