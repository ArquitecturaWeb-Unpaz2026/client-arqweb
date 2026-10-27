export type ApiErrorBody = {
  message?: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorBody | null

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
