/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_THIRDWEB_CLIENT_ID: string;
    VITE_THIRDWEB_SECRET_KEY: string;
    VITE_THIRDWEB_WALLET_ADDRESS: string;
    VITE_THIRDWEB_WALLET_PRIVATE_KEY: string;
    VITE_VAULT_ACCESS_TOKEN: string;
    VITE_RWA_DEPLOYED_CONTRACT_ADDRESS: string;
    VITE_THIRDWEB_AUTH_DOMAIN: string;
    // Firebase Configuration
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
    // API Configuration
    VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}