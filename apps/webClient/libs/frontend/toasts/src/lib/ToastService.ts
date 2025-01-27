/** ToastService.ts
 * Copyright (c) 2023, TowechLabs
 *
 * Zustand store that handles the currently active toasts
 */
import { StateCreator, create } from 'zustand';
// import { devtools } from 'zustand/middleware';
import { v4 as uuidV4 } from 'uuid';

// Types ----------------------------------------------------------------------
export type Toast = {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
};
export type NewToast = Omit<Toast, 'id'>;
type State = {
  toasts: Toast[];
  add: (toast: NewToast) => void;
  dismiss: (id: string) => void;
};
type SetState<T extends State> = {
  _(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    actionName?: string
  ): void;
}['_'];

// Store ----------------------------------------------------------------------
const store: StateCreator<State> = (set: SetState<State>) => ({
  toasts: [],
  add: (toast) => set((state) => addToast(toast, state), true, 'addToast'),
  dismiss: (id) => set((state) => removeToast(id, state), true, 'removeToast'),
});
export const useToastStore = create(store);
// export const useToastStore = create(devtools(store));

// Selectors ------------------------------------------------------------------
export const useToasts = () => useToastStore((store) => store.toasts);
export const useAddToast = () => useToastStore((store) => store.add);
export const useDismissToast = () => useToastStore((store) => store.dismiss);

// Adapter --------------------------------------------------------------------
const addToast = (toast: NewToast, state: State): State => {
  const idToast = { id: uuidV4(), ...toast };
  return { ...state, toasts: [idToast, ...state.toasts] };
};
const removeToast = (id: string, state: State): State => {
  return { ...state, toasts: state.toasts.filter((t) => t.id !== id) };
};
