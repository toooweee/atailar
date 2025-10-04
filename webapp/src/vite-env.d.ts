/// <reference types="vite/client" />
export type Env = {
  REACT_APP_HOST: string;
  REACT_APP_LOGIN: string;
  REACT_APP_REFRESH: string;
};

export {};

declare global {
  interface Window {
    env: {
      VITE_SERVICES_HOST: string;
    };
  }
}
