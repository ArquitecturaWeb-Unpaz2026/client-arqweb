import type { Role } from '@/features/auth/types'

const ADMIN_ROLES = new Set([
  'admin',
  'administrador',
  'administrator',
  'role_admin',
  'role_administrador',
])

/** Traduce el nombre de rol de la API (`roles.nombre`) al rol de la interfaz. */
export function mapApiRole(rol: string | undefined | null): Role {
  const normalized = (rol ?? '').trim().toLowerCase()
  return ADMIN_ROLES.has(normalized) ? 'admin' : 'member'
}

export function cleanDisplayName(nombre?: string | null): string {
  return (nombre ?? '').replace(/\s+demo$/i, '').trim()
}

export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? ''
  const key = local.toLowerCase()
  if (key === 'admin') return 'Administrador'
  if (key === 'member') return 'Miembro'
  return local || email
}
