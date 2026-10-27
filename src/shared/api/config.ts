export function useMockApi(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true'
}

export function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? '/api'
  return base.replace(/\/$/, '')
}
