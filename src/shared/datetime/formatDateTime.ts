import { isClosedStatus } from '@/shared/tasks/statusLabels'
import type { TaskStatus } from '@/features/tasks/types'

const TIME_ZONE = 'America/Argentina/Buenos_Aires'

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((entry) => entry.type === type)?.value ?? ''
}

/** `dd/mm/yyyy hh:mm` en hora de Argentina. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  return `${part(parts, 'day')}/${part(parts, 'month')}/${part(parts, 'year')} ${part(parts, 'hour')}:${part(parts, 'minute')}`
}

/** Vencida si la fecha ya pasó y la tarea sigue abierta. */
export function isOverdue(dueDate: string | null | undefined, status: TaskStatus): boolean {
  if (!dueDate || isClosedStatus(status)) return false
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() < Date.now()
}
