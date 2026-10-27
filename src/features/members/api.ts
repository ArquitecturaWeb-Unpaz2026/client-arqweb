import { api } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import type { Member } from './types'
import * as mock from './api.mock'

/** Miembros del equipo; datos del servidor en otro repositorio. */
export function listMembers(): Promise<Member[]> {
  if (useMockApi()) return mock.mockListMembers()
  return api.get<Member[]>('/members')
}
