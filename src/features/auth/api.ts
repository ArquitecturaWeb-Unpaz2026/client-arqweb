import { api, getStoredAccessToken } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import { decodeJwtPayload } from '@/shared/api/jwt'
import { displayNameFromEmail, mapApiRole } from '@/shared/auth/mapRole'
import type { AuthSession, LoginCredentials, User } from './types'
import * as mock from './api.mock'

type TokenResponse = {
  token: string
  tipo?: string
  expiraEnSegundos?: number
  email?: string
  rol?: string
}

function userFromToken(token: string, email?: string, rol?: string): User {
  const payload = decodeJwtPayload(token)
  if (!payload) {
    throw new Error('Sesión inválida')
  }
  const resolvedEmail = email || payload.sub || ''
  return {
    id: String(payload.uid ?? ''),
    email: resolvedEmail,
    name: displayNameFromEmail(resolvedEmail),
    role: mapApiRole(rol || payload.rol),
  }
}

/** Llama a la API de autenticación (o al simulador local si VITE_USE_MOCK_API=true). */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (useMockApi()) {
    return mock.mockLogin(credentials)
  }
  const data = await api.post<TokenResponse>('/auth/login', credentials, { auth: false })
  return {
    accessToken: data.token,
    user: userFromToken(data.token, data.email, data.rol),
  }
}

export async function fetchMe(): Promise<User> {
  if (useMockApi()) {
    const token = getStoredAccessToken()
    if (!token) {
      throw new Error('No hay sesión activa')
    }
    return mock.mockFetchMe(token)
  }
  const token = getStoredAccessToken()
  if (!token) {
    throw new Error('No hay sesión activa')
  }
  return userFromToken(token)
}

export async function logout(): Promise<void> {
  // La API no publica /auth/logout; la sesión JWT se limpia en el cliente.
}
