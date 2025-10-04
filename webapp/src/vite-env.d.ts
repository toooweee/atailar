/// <reference types="vite/client" />
export type Env = {
  REACT_APP_HOST: string;
  REACT_APP_AUTH: string;
  REACT_APP_AUTH_LOGIN: string;
  REACT_APP_AUTH_ME: string;
  REACT_APP_AUTH_REFRESH: string;
};

export {};

declare global {
  interface Window {
    env: {
      REACT_APP_HOST: string;
    };
  }
}
