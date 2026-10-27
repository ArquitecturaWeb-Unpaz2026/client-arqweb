import type { Task, TaskInput } from './types'

let tasks: Task[] = [
  {
    id: 't-1',
    title: 'Definir contrato de API',
    description: 'Documentar endpoints existentes y tipos de respuesta.',
    status: 'done',
    assigneeId: 'u-admin',
    dueDate: '2026-10-20',
    createdAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 't-2',
    title: 'Listado de tareas',
    description: 'Vista con filtros básicos y estados.',
    status: 'in_progress',
    assigneeId: 'u-member',
    dueDate: '2026-10-28',
    createdAt: '2026-10-15T12:00:00.000Z',
  },
  {
    id: 't-3',
    title: 'Gestión de miembros',
    description: 'Solo visible para administradores.',
    status: 'todo',
    assigneeId: null,
    dueDate: null,
    createdAt: '2026-10-18T09:30:00.000Z',
  },
]

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

export async function mockCreateTask(input: TaskInput): Promise<Task> {
  await delay()
  const task: Task = {
    id: `t-${Date.now()}`,
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'todo',
    assigneeId: input.assigneeId ?? null,
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
  const updated: Task = {
    ...current,
    ...input,
    title: input.title ?? current.title,
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
