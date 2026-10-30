import { useSessionStore } from '@/features/auth/stores/session'
import { api, getStoredAccessToken } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import { currentUserIdFromToken } from '@/shared/api/jwt'
import { canAccessTask, canMutateTask } from '@/shared/auth/permissions'
import { estadoIdForStatus } from '@/shared/tasks/statusLabels'
import type { Task, TaskInput } from './types'
import * as mock from './api.mock'
import { type ApiTarea, mapTarea } from './mappers'

function creatorId(): number {
  const id = currentUserIdFromToken(getStoredAccessToken())
  if (id == null) {
    throw new Error('No hay sesión activa')
  }
  return id
}

function toWriteBody(body: TaskInput, includeCreator: boolean): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    titulo: body.title,
    descripcion: body.description ?? '',
    estado: { id: estadoIdForStatus(body.status) },
    usuario: body.assigneeId ? { id: Number(body.assigneeId) } : null,
    fechaVencimiento: body.dueDate ?? null,
  }
  if (includeCreator) {
    payload.creador = { id: creatorId() }
  }
  return payload
}

function actor() {
  const session = useSessionStore()
  return { role: session.role, userId: session.user?.id }
}

function visibleTasksForActor(tasks: Task[]): Task[] {
  const { role, userId } = actor()
  return tasks.filter((task) => canAccessTask(role, userId, task))
}

function assertCanAccess(task: Task): void {
  const { role, userId } = actor()
  if (!canAccessTask(role, userId, task)) {
    throw new Error('No tenés permiso para acceder a esta tarea')
  }
}

function assertCanMutate(task: Task, permission: 'task.edit' | 'task.status' | 'task.delete'): void {
  const { role, userId } = actor()
  if (!canMutateTask(role, userId, task, permission)) {
    throw new Error('No tenés permiso para modificar esta tarea')
  }
}

function applyCreatePolicy(body: TaskInput): TaskInput {
  const { role, userId } = actor()
  if (role === 'member' && userId) {
    return { ...body, assigneeId: userId }
  }
  return body
}

function applyUpdatePolicy(current: Task, body: TaskInput): TaskInput {
  const { role } = actor()
  if (role === 'member') {
    return {
      title: current.title,
      description: current.description,
      status: body.status ?? current.status,
      assigneeId: current.assigneeId,
      dueDate: current.dueDate,
    }
  }
  return body
}

async function loadTaskRaw(id: string): Promise<Task> {
  if (useMockApi()) return mock.mockGetTask(id)
  const row = await api.get<ApiTarea>(`/tareas/${id}`)
  return mapTarea(row)
}

/** Endpoints de tareas; la API vive en otro repositorio. */
export async function listTasks(): Promise<Task[]> {
  if (useMockApi()) {
    return visibleTasksForActor(await mock.mockListTasks())
  }
  const rows = await api.get<ApiTarea[]>('/tareas')
  return visibleTasksForActor(rows.map(mapTarea))
}

export async function getTask(id: string): Promise<Task> {
  const task = await loadTaskRaw(id)
  assertCanAccess(task)
  return task
}

export async function createTask(body: TaskInput): Promise<Task> {
  const input = applyCreatePolicy(body)
  const { userId } = actor()
  if (useMockApi()) {
    return mock.mockCreateTask(input, userId)
  }
  const created = await api.post<ApiTarea>('/tareas', toWriteBody(input, true))
  return mapTarea(created)
}

export async function updateTask(id: string, body: TaskInput): Promise<Task> {
  const current = await loadTaskRaw(id)
  const { role } = actor()
  assertCanMutate(current, role === 'member' ? 'task.status' : 'task.edit')
  const input = applyUpdatePolicy(current, body)
  if (useMockApi()) return mock.mockUpdateTask(id, input)
  const updated = await api.put<ApiTarea>(`/tareas/${id}`, toWriteBody(input, false))
  return mapTarea(updated)
}

export async function deleteTask(id: string): Promise<void> {
  const current = await loadTaskRaw(id)
  assertCanMutate(current, 'task.delete')
  if (useMockApi()) return mock.mockDeleteTask(id)
  return api.delete<void>(`/tareas/${id}`)
}
