import { createContext } from 'react';

export type ToastType = 'success' | 'error';

export type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
