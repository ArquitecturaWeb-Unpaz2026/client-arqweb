import { api } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import type { Task, TaskInput } from './types'
import * as mock from './api.mock'

/** Endpoints de tareas; la API vive en otro repositorio. */
export function listTasks(): Promise<Task[]> {
  if (useMockApi()) return mock.mockListTasks()
  return api.get<Task[]>('/tasks')
}

export function getTask(id: string): Promise<Task> {
  if (useMockApi()) return mock.mockGetTask(id)
  return api.get<Task>(`/tasks/${id}`)
}

export function createTask(body: TaskInput): Promise<Task> {
  if (useMockApi()) return mock.mockCreateTask(body)
  return api.post<Task>('/tasks', body)
}

export function updateTask(id: string, body: TaskInput): Promise<Task> {
  if (useMockApi()) return mock.mockUpdateTask(id, body)
  return api.patch<Task>(`/tasks/${id}`, body)
}

export function deleteTask(id: string): Promise<void> {
  if (useMockApi()) return mock.mockDeleteTask(id)
  return api.delete<void>(`/tasks/${id}`)
}
