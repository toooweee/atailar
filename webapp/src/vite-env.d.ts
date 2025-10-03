/// <reference types="vite/client" />
export type Env = {
  REACT_APP_HOST: string;
};

export {};

declare global {
  interface Window {
    env: {
      VITE_SERVICES_HOST: string;
    };
  }
}
