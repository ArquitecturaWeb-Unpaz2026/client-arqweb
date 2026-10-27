import type { Role } from '@/features/auth/types'

export type Permission =
  | 'task.view'
  | 'task.create'
  | 'task.edit'
  | 'task.delete'
  | 'task.assign'
  | 'member.view'
  | 'member.manage'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'task.view',
    'task.create',
    'task.edit',
    'task.delete',
    'task.assign',
    'member.view',
    'member.manage',
  ],
  member: ['task.view', 'task.create', 'task.edit'],
}

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return permissionsForRole(role).includes(permission)
}
