import type { Env } from './vite-env';

export const env: Env = {
  REACT_APP_HOST: 'http://localhost:3000',
  REACT_APP_AUTH: '/auth',
  REACT_APP_USERS: '/users',
  REACT_APP_ACCESS_REQUEST: '/access-request',
  REACT_APP_SECRET: '/secret',
  REACT_APP_AUTH_LOGIN: '/login',
  REACT_APP_AUTH_LOGOUT: 'logout',
  REACT_APP_AUTH_REFRESH: '/refresh',
  REACT_APP_AUTH_ME: '/me',
  REACT_APP_USERS_CHANGE_PASSWORD: '/update-password'
}
