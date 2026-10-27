import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getStoredAccessToken, setStoredAccessToken } from '@/shared/api/client'
import * as authApi from '../api'
import type { LoginCredentials, User } from '../types'

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const bootstrapped = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role)

  async function bootstrap(): Promise<void> {
    if (bootstrapped.value) return
    bootstrapped.value = true

    const token = getStoredAccessToken()
    if (!token) return

    try {
      user.value = await authApi.fetchMe()
    } catch {
      setStoredAccessToken(null)
      user.value = null
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const session = await authApi.login(credentials)
      setStoredAccessToken(session.accessToken)
      user.value = session.user
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'No se pudo iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      setStoredAccessToken(null)
      user.value = null
    }
  }

  return {
    user,
    role,
    loading,
    error,
    bootstrapped,
    isAuthenticated,
    bootstrap,
    login,
    logout,
  }
})
