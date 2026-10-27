import type { Role } from '@/features/auth/types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: Role[]
    pageTitle?: string
  }
}

export {}
