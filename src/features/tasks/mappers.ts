import type { Role } from '@/features/auth/types'
import { cleanDisplayName, mapApiRole } from '@/shared/auth/mapRole'
import { statusFromEstadoNombre } from '@/shared/tasks/statusLabels'
import type { Task } from './types'

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
    status: statusFromEstadoNombre(tarea.estado?.nombre),
    assigneeId: tarea.usuario?.id != null ? String(tarea.usuario.id) : null,
    assigneeName: assigneeNameFrom(tarea.usuario),
    creatorId: tarea.creador?.id != null ? String(tarea.creador.id) : null,
    dueDate: tarea.fechaVencimiento ?? null,
    createdAt: tarea.fechaCreacion ?? new Date().toISOString(),
  }
}

function assigneeNameFrom(usuario: ApiUsuario | null | undefined): string | null {
  if (!usuario) return null
  const email = usuario.email ?? ''
  return cleanDisplayName(usuario.nombre) || email || `Usuario ${usuario.id}`
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
