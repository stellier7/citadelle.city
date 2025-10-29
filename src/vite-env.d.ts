/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RWA_DEPLOYED_CONTRACT_ADDRESS: string
  readonly VITE_VERIFIER_ADDRESS: string
  readonly VITE_THIRDWEB_CLIENT_ID: string
  readonly VITE_REVENUE_CONTRACT_ADDRESS: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
