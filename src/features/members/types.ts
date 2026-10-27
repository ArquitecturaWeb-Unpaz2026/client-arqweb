import type { Role } from '@/features/auth/types'

export type Member = {
  id: string
  email: string
  name: string
  role: Role
}
