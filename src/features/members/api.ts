import type { Role } from '@/features/auth/types'
import type { ApiUsuario } from '@/features/tasks/mappers'
import { memberFromUsuario } from '@/features/tasks/mappers'
import { api } from '@/shared/api/client'
import { useMockApi } from '@/shared/api/config'
import type { Member, MemberInput } from './types'
import * as mock from './api.mock'

const ROLE_IDS: Record<Role, number> = {
  admin: 1,
  member: 2,
}

function toBody(input: MemberInput, includePassword: boolean): Record<string, unknown> {
  const body: Record<string, unknown> = {
    nombre: input.name.trim(),
    email: input.email.trim(),
    idRol: ROLE_IDS[input.role],
  }
  if (includePassword) {
    body.password = input.password ?? ''
  } else if (input.password?.trim()) {
    body.password = input.password.trim()
  }
  return body
}

/** Integrantes vigentes. La baja es lógica y no aparecen en este listado. */
export async function listMembers(): Promise<Member[]> {
  if (useMockApi()) return mock.mockListMembers()
  const rows = await api.get<ApiUsuario[]>('/usuarios')
  return rows.map(memberFromUsuario)
}

export async function createMember(input: MemberInput): Promise<Member> {
  if (useMockApi()) return mock.mockCreateMember(input)
  const created = await api.post<ApiUsuario>('/usuarios', toBody(input, true))
  return memberFromUsuario(created)
}

export async function updateMember(id: string, input: MemberInput): Promise<Member> {
  if (useMockApi()) return mock.mockUpdateMember(id, input)
  const updated = await api.put<ApiUsuario>(`/usuarios/${id}`, toBody(input, false))
  return memberFromUsuario(updated)
}

export async function deleteMember(id: string): Promise<void> {
  if (useMockApi()) return mock.mockDeleteMember(id)
  await api.delete<void>(`/usuarios/${id}`)
}
