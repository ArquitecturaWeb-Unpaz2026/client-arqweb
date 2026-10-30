import type { Role } from '@/features/auth/types'

export type Member = {
  id: string
  email: string
  name: string
  role: Role
}

export type MemberInput = {
  name: string
  email: string
  role: Role
  password?: string
}
