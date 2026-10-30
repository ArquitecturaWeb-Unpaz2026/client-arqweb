import type { Role } from '@/features/auth/types'
import { cleanDisplayName, mapApiRole } from '@/shared/auth/mapRole'
import type { Task, TaskStatus } from './types'

export type ApiEstado = {
  id: number
  nombre: string
}

export type ApiRol = {
  id?: number
  nombre?: string
}

export type ApiUsuario = {
  id: number
  nombre?: string
  email?: string
  rol?: ApiRol | string | null
}

export type ApiTarea = {
  id: number
  titulo: string
  descripcion?: string | null
  estado?: ApiEstado | null
  usuario?: ApiUsuario | null
  creador?: ApiUsuario | null
  fechaCreacion?: string | null
  fechaInicio?: string | null
  fechaVencimiento?: string | null
}

function mapEstadoNombre(nombre?: string | null): TaskStatus {
  const normalized = (nombre ?? '').trim().toLowerCase()
  if (
    ['done', 'completada', 'completa', 'finalizada', 'resuelta', 'cerrada'].includes(
      normalized,
    )
  ) {
    return 'done'
  }
  if (
    [
      'in_progress',
      'en progreso',
      'en_progreso',
      'en curso',
      'en_curso',
      'progreso',
      'trabajando',
    ].includes(normalized)
  ) {
    return 'in_progress'
  }
  return 'todo'
}

function roleFromUsuario(usuario: ApiUsuario): Role {
  if (typeof usuario.rol === 'string') {
    return mapApiRole(usuario.rol)
  }
  return mapApiRole(usuario.rol?.nombre)
}

export function mapTarea(tarea: ApiTarea): Task {
  return {
    id: String(tarea.id),
    title: tarea.titulo,
    description: tarea.descripcion ?? '',
    status: mapEstadoNombre(tarea.estado?.nombre),
    assigneeId: tarea.usuario?.id != null ? String(tarea.usuario.id) : null,
    creatorId: tarea.creador?.id != null ? String(tarea.creador.id) : null,
    dueDate: tarea.fechaVencimiento ?? null,
    createdAt: tarea.fechaCreacion ?? new Date().toISOString(),
  }
}

export function memberFromUsuario(usuario: ApiUsuario) {
  const email = usuario.email ?? ''
  return {
    id: String(usuario.id),
    email,
    name: cleanDisplayName(usuario.nombre) || email || `Usuario ${usuario.id}`,
    role: roleFromUsuario(usuario),
  }
}

export function defaultEstadoId(fromTasks: ApiTarea[] = []): number {
  const known = fromTasks.find((tarea) => tarea.estado?.id != null)?.estado?.id
  if (known != null) return known
  const fromEnv = Number(import.meta.env.VITE_DEFAULT_ESTADO_ID ?? 1)
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 1
}
