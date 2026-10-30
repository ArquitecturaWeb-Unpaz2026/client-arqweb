import { api, getStoredAccessToken } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import { decodeJwtPayload } from '@/shared/api/jwt'
import { displayNameFromEmail, mapApiRole } from '@/shared/auth/mapRole'
import type { ApiTarea } from '@/features/tasks/mappers'
import { memberFromUsuario } from '@/features/tasks/mappers'
import type { Member } from './types'
import * as mock from './api.mock'

/** Miembros del equipo. La API no publica /members: se derivan de las tareas. */
export async function listMembers(): Promise<Member[]> {
  if (useMockApi()) return mock.mockListMembers()

  const rows = await api.get<ApiTarea[]>('/tareas')
  const byId = new Map<string, Member>()

  const token = getStoredAccessToken()
  const payload = token ? decodeJwtPayload(token) : null
  if (payload?.uid != null && payload.uid !== '') {
    const email = payload.sub ?? ''
    byId.set(String(payload.uid), {
      id: String(payload.uid),
      email,
      name: displayNameFromEmail(email),
      role: mapApiRole(payload.rol),
    })
  }

  for (const tarea of rows) {
    for (const usuario of [tarea.creador, tarea.usuario]) {
      if (!usuario) continue
      const member = memberFromUsuario(usuario)
      byId.set(member.id, member)
    }
  }

  return [...byId.values()]
}
