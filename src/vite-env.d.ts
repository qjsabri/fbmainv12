/// <reference types="vite/client" />

interface Window {
  requestIdleCallback: (
    callback: (deadline: {
      didTimeout: boolean;
      timeRemaining: () => number;
    }) => void,
    opts?: { timeout: number }
  ) => number;
  cancelIdleCallback: (handle: number) => void;
}