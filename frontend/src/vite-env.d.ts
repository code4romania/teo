/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_AWS_REGION: string;
  readonly VITE_USER_POOL_ID: string;
  readonly VITE_USER_POOL_CLIENT_ID: string;
  readonly VITE_COGNITO_OAUTH_DOMAIN: string;
}
