export type Role = 'admin' | 'member'

export type User = {
  id: string
  email: string
  name: string
  role: Role
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthSession = {
  accessToken: string
  user: User
}
