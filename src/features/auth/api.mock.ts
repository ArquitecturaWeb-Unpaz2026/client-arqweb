import type { AuthSession, LoginCredentials, User } from './types'

const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'u-admin',
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Administrador Demo',
    role: 'admin',
  },
  {
    id: 'u-member',
    email: 'member@demo.com',
    password: 'demo123',
    name: 'Miembro Demo',
    role: 'member',
  },
]

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockLogin(credentials: LoginCredentials): Promise<AuthSession> {
  await delay()
  const match = MOCK_USERS.find(
    (user) => user.email === credentials.email && user.password === credentials.password,
  )
  if (!match) {
    throw new Error('Credenciales inválidas (prueba admin@demo.com / demo123)')
  }
  const { password: _password, ...user } = match
  return {
    accessToken: `mock-token-${user.id}`,
    user,
  }
}

export async function mockFetchMe(token: string): Promise<User> {
  await delay(200)
  const userId = token.replace('mock-token-', '')
  const user = MOCK_USERS.find((entry) => entry.id === userId)
  if (!user) {
    throw new Error('Sesión inválida')
  }
  const { password: _password, ...safeUser } = user
  return safeUser
}
