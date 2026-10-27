import type { Role } from '@/features/auth/types'

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  member: 'Miembro',
}

export function roleLabel(role: Role | undefined | null): string {
  if (!role) return '—'
  return ROLE_LABELS[role]
}
