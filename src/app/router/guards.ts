import type { RouteLocationNormalized, Router } from 'vue-router'
import type { Role } from '@/features/auth/types'
import { useSessionStore } from '@/features/auth/stores/session'

function matchedRoles(to: RouteLocationNormalized): Role[] | undefined {
  for (let i = to.matched.length - 1; i >= 0; i -= 1) {
    const roles = to.matched[i]?.meta.roles
    if (roles) return roles as Role[]
  }
  return undefined
}

export function registerRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    const session = useSessionStore()
    if (!session.bootstrapped) {
      await session.bootstrap()
    }

    const guestOnly = to.matched.some((record) => record.meta.guestOnly)
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (guestOnly && session.isAuthenticated) {
      return { name: 'tasks' }
    }

    if (requiresAuth && !session.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    const allowedRoles = matchedRoles(to)
    if (allowedRoles && session.role && !allowedRoles.includes(session.role)) {
      return { name: 'tasks' }
    }

    return true
  })
}
