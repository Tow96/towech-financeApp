/** NavbarService.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Zustand store that handles the state of the navbar
 * It is mainly used for the title of the screen
 */
import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types ----------------------------------------------------------------------
type State = {
  title: string;
  updateTitle: (title: string) => void;
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
  title: '',
  updateTitle: title => set(state => updateTitle(title, state), true, 'updateNavbarTitle'),
});
export const useNavStore =
  process.env.NEXT_PUBLIC_DEBUG === 'True' ? create(devtools(store)) : create(store);

// Selectors ------------------------------------------------------------------
export const useUpdateTitle = () => useNavStore(store => store.updateTitle);

// Adapter --------------------------------------------------------------------
const updateTitle = (title: string, state: State): State => {
  const formattedTitle = title
    .split(' ')
    .map(s => s.toLowerCase())
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return { ...state, title: formattedTitle };
};
