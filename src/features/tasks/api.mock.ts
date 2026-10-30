import type { Task, TaskInput } from './types'

const names: Record<string, string> = {
  'u-admin': 'Administrador',
  'u-member': 'Miembro',
  'u-3': 'Ana García',
}

let tasks: Task[] = [
  {
    id: 't-1',
    title: 'Definir contrato de API',
    description: 'Documentar endpoints existentes y tipos de respuesta.',
    status: 'resuelta',
    assigneeId: 'u-admin',
    assigneeName: 'Administrador',
    creatorId: 'u-admin',
    dueDate: '2026-10-20T16:00:00.000Z',
    createdAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 't-2',
    title: 'Listado de tareas',
    description: 'Vista con filtros básicos y estados.',
    status: 'en_proceso',
    assigneeId: 'u-member',
    assigneeName: 'Miembro',
    creatorId: 'u-admin',
    dueDate: '2026-10-28T18:00:00.000Z',
    createdAt: '2026-10-15T12:00:00.000Z',
  },
  {
    id: 't-3',
    title: 'Gestión de miembros',
    description: 'Solo visible para administradores.',
    status: 'pendiente',
    assigneeId: null,
    assigneeName: null,
    creatorId: 'u-admin',
    dueDate: null,
    createdAt: '2026-10-18T09:30:00.000Z',
  },
]

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function nameFor(assigneeId: string | null | undefined): string | null {
  if (!assigneeId) return null
  return names[assigneeId] ?? `Usuario ${assigneeId}`
}

export async function mockListTasks(): Promise<Task[]> {
  await delay()
  return [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function mockGetTask(id: string): Promise<Task> {
  await delay()
  const task = tasks.find((entry) => entry.id === id)
  if (!task) {
    throw new Error('Tarea no encontrada')
  }
  return { ...task }
}

export async function mockCreateTask(input: TaskInput, creatorId?: string | null): Promise<Task> {
  await delay()
  const task: Task = {
    id: `t-${Date.now()}`,
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'pendiente',
    assigneeId: input.assigneeId ?? null,
    assigneeName: nameFor(input.assigneeId),
    creatorId: creatorId ?? input.assigneeId ?? null,
    dueDate: input.dueDate ?? null,
    createdAt: new Date().toISOString(),
  }
  tasks = [task, ...tasks]
  return task
}

export async function mockUpdateTask(id: string, input: TaskInput): Promise<Task> {
  await delay()
  const index = tasks.findIndex((entry) => entry.id === id)
  if (index === -1) {
    throw new Error('Tarea no encontrada')
  }
  const current = tasks[index]!
  const assigneeId = input.assigneeId === undefined ? current.assigneeId : input.assigneeId
  const updated: Task = {
    ...current,
    ...input,
    title: input.title ?? current.title,
    assigneeId,
    assigneeName: input.assigneeId === undefined ? current.assigneeName : nameFor(assigneeId),
  }
  tasks[index] = updated
  return { ...updated }
}

export async function mockDeleteTask(id: string): Promise<void> {
  await delay()
  const before = tasks.length
  tasks = tasks.filter((entry) => entry.id !== id)
  if (tasks.length === before) {
    throw new Error('Tarea no encontrada')
  }
}
