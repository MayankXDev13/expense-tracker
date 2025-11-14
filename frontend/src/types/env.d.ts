export {};

declare global {
  interface Window {
    env: {
      VITE_BACKEND_URL: string;
    };
  }
}
