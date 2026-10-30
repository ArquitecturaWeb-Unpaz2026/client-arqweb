import type { Role } from '@/features/auth/types'

export type Permission =
  | 'task.view'
  | 'task.create'
  | 'task.edit'
  | 'task.status'
  | 'task.delete'
  | 'task.assign'
  | 'member.view'
  | 'member.manage'

export type TaskOwnership = {
  assigneeId: string | null
  creatorId?: string | null
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'task.view',
    'task.create',
    'task.edit',
    'task.status',
    'task.delete',
    'task.assign',
    'member.view',
    'member.manage',
  ],
  member: ['task.view', 'task.create', 'task.status'],
}

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return permissionsForRole(role).includes(permission)
}

export function isOwnTask(task: TaskOwnership, userId: string | undefined): boolean {
  if (!userId) return false
  return task.assigneeId === userId || task.creatorId === userId
}

/** El admin ve todas; el miembro solo las que creó o tiene asignadas. */
export function canAccessTask(
  role: Role | undefined,
  userId: string | undefined,
  task: TaskOwnership,
): boolean {
  if (!role) return false
  if (role === 'admin') return true
  return isOwnTask(task, userId)
}

export function canMutateTask(
  role: Role | undefined,
  userId: string | undefined,
  task: TaskOwnership,
  permission: Extract<Permission, 'task.edit' | 'task.status' | 'task.delete'>,
): boolean {
  return can(role, permission) && canAccessTask(role, userId, task)
}
