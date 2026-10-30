/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_API: string
  readonly VITE_API_PROXY_TARGET: string
  readonly VITE_DEFAULT_ESTADO_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
