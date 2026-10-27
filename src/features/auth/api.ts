import { api, getStoredAccessToken } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import type { AuthSession, LoginCredentials, User } from './types'
import * as mock from './api.mock'

/** Llama a la API de autenticación (o al simulador local si VITE_USE_MOCK_API=true). */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (useMockApi()) {
    return mock.mockLogin(credentials)
  }
  return api.post<AuthSession>('/auth/login', credentials, { auth: false })
}

export async function fetchMe(): Promise<User> {
  if (useMockApi()) {
    const token = getStoredAccessToken()
    if (!token) {
      throw new Error('No hay sesión activa')
    }
    return mock.mockFetchMe(token)
  }
  return api.get<User>('/auth/me')
}

export async function logout(): Promise<void> {
  if (useMockApi()) {
    return
  }
  await api.post<void>('/auth/logout')
}
