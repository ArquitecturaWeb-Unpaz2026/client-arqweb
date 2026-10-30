export type JwtPayload = {
  sub?: string
  uid?: number | string
  rol?: string
  exp?: number
}

/** Lee el payload del JWT. La API no expone /auth/me; el token ya trae uid, email y rol. */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='))
    const payload = JSON.parse(json) as JwtPayload
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function currentUserIdFromToken(token: string | null): number | null {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (payload?.uid == null || payload.uid === '') return null
  const id = Number(payload.uid)
  return Number.isFinite(id) ? id : null
}
