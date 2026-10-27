import type { Member } from './types'

const members: Member[] = [
  { id: 'u-admin', email: 'admin@demo.com', name: 'Administrador Demo', role: 'admin' },
  { id: 'u-member', email: 'member@demo.com', name: 'Miembro Demo', role: 'member' },
  { id: 'u-3', email: 'ana@demo.com', name: 'Ana García', role: 'member' },
]

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockListMembers(): Promise<Member[]> {
  await delay()
  return [...members]
}
