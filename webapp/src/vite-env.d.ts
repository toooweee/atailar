/// <reference types="vite/client" />
export type Env = {
  REACT_APP_HOST: string;
  REACT_APP_AUTH: string;
  REACT_APP_USERS: string;
  REACT_APP_ACCESS_REQUEST: string;
  REACT_APP_SECRET: string;
  REACT_APP_AUTH_LOGIN: string;
  REACT_APP_AUTH_LOGOUT: string;
  REACT_APP_AUTH_REFRESH: string;
  REACT_APP_AUTH_ME: string;
  REACT_APP_USERS_CHANGE_PASSWORD: string;
  // REACT_APP_USERS_FIND_ALL: string;
  // REACT_APP_USERS_CREATE: string;
};

export {};

declare global {
  interface Window {
    env: {
      REACT_APP_HOST: string;
    };
  }
}
