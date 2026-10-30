import type { TaskStatus } from '@/features/tasks/types'

/** Catálogo de la tabla estados. Los id coinciden con el seed de MySQL. */
export const TASK_STATUS_CATALOG: { status: TaskStatus; id: number; label: string }[] = [
  { status: 'pendiente', id: 1, label: 'Pendiente' },
  { status: 'asignada', id: 2, label: 'Asignada' },
  { status: 'en_proceso', id: 3, label: 'En proceso' },
  { status: 'resuelta', id: 4, label: 'Resuelta' },
  { status: 'cancelada', id: 5, label: 'Cancelada' },
]

export const PENDIENTE_ESTADO_ID = 1

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  asignada: 'Asignada',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  cancelada: 'Cancelada',
}

const STATUS_BY_NAME: Record<string, TaskStatus> = {
  pendiente: 'pendiente',
  todo: 'pendiente',
  'por hacer': 'pendiente',
  asignada: 'asignada',
  en_proceso: 'en_proceso',
  'en proceso': 'en_proceso',
  en_progreso: 'en_proceso',
  'en progreso': 'en_proceso',
  resuelta: 'resuelta',
  done: 'resuelta',
  completada: 'resuelta',
  completa: 'resuelta',
  finalizada: 'resuelta',
  cerrada: 'resuelta',
  cancelada: 'cancelada',
}

export function taskStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_LABELS[status]
}

export function estadoIdForStatus(status: TaskStatus | undefined): number {
  const match = TASK_STATUS_CATALOG.find((entry) => entry.status === status)
  return match?.id ?? PENDIENTE_ESTADO_ID
}

export function statusFromEstadoNombre(nombre?: string | null): TaskStatus {
  const normalized = (nombre ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
  return STATUS_BY_NAME[normalized] ?? 'pendiente'
}

export function isClosedStatus(status: TaskStatus): boolean {
  return status === 'resuelta' || status === 'cancelada'
}
