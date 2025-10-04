import type { Env } from './vite-env';

export const env: Env = {
  REACT_APP_HOST: 'http://localhost:3000',
  REACT_APP_AUTH: '/auth',
  REACT_APP_AUTH_ME: '/me',
  REACT_APP_AUTH_LOGIN: '/login',
  REACT_APP_AUTH_REFRESH: '/refresh_token',
}
