export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string | null
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
