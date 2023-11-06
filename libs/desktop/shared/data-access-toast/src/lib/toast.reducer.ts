import { createReducer, on } from '@ngrx/store';
import { DesktopToast, NewToast, ToastTypes } from './types';
import { toastActions } from './toast.actions';
import * as uuid from 'uuid';

const addToast = (state: DesktopToast[], newToast: NewToast, type: ToastTypes): DesktopToast[] => {
  const toast: DesktopToast = { id: uuid.v4(), type, ...newToast };

  // TODO: Use state.toSpliced(0, 0, newToast) when it finally arrives
  return [toast, ...state];
};
const removeToast = (state: DesktopToast[], id: string): DesktopToast[] => [
  ...state.filter(t => t.id !== id),
];

export const reducer = createReducer<DesktopToast[]>(
  [],
  on(toastActions.addAccent, (state, { payload }) => addToast(state, payload, ToastTypes.ACCENT)),
  on(toastActions.addError, (state, { payload }) => addToast(state, payload, ToastTypes.ERROR)),
  on(toastActions.addSuccess, (state, { payload }) => addToast(state, payload, ToastTypes.SUCCESS)),
  on(toastActions.addWarning, (state, { payload }) => addToast(state, payload, ToastTypes.WARNING)),
  on(toastActions.dismiss, (state, { payload }) => removeToast(state, payload))
);
