export type TaskStatus = 'pendiente' | 'asignada' | 'en_proceso' | 'resuelta' | 'cancelada'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string | null
  assigneeName: string | null
  creatorId: string | null
  dueDate: string | null
  createdAt: string
}

export type TaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  assigneeId?: string | null
  dueDate?: string | null
}
