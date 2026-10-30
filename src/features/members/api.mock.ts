import type { Member, MemberInput } from './types'

let members: Member[] = [
  { id: 'u-admin', email: 'admin@demo.com', name: 'Administrador', role: 'admin' },
  { id: 'u-member', email: 'member@demo.com', name: 'Miembro', role: 'member' },
  { id: 'u-3', email: 'ana@demo.com', name: 'Ana García', role: 'member' },
]

const retired: Member[] = []

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockListMembers(): Promise<Member[]> {
  await delay()
  return [...members]
}

export async function mockCreateMember(input: MemberInput): Promise<Member> {
  await delay()
  const email = input.email.trim().toLowerCase()
  const taken = [...members, ...retired].some((member) => member.email.toLowerCase() === email)
  if (taken) {
    throw new Error('El email ya está registrado')
  }
  const member: Member = {
    id: `u-${Date.now()}`,
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
  }
  members = [...members, member]
  return member
}

export async function mockUpdateMember(id: string, input: MemberInput): Promise<Member> {
  await delay()
  const index = members.findIndex((member) => member.id === id)
  if (index === -1) {
    throw new Error('No existe el usuario')
  }
  const email = input.email.trim().toLowerCase()
  const taken = [...members, ...retired].some(
    (member) => member.id !== id && member.email.toLowerCase() === email,
  )
  if (taken) {
    throw new Error('El email ya está registrado')
  }
  const updated: Member = {
    ...members[index]!,
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
  }
  members[index] = updated
  return updated
}

export async function mockDeleteMember(id: string): Promise<void> {
  await delay()
  const index = members.findIndex((member) => member.id === id)
  if (index === -1) {
    throw new Error('No existe el usuario')
  }
  const [removed] = members.splice(index, 1)
  if (removed) retired.push(removed)
}
