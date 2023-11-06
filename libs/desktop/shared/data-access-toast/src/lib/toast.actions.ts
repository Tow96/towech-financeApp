import { createActionGroup, props } from '@ngrx/store';
import { NewToast } from './types';

export const toastActions = createActionGroup({
  source: 'Toast Service',
  events: {
    addAccent: props<{ payload: NewToast }>(),
    addError: props<{ payload: NewToast }>(),
    addSuccess: props<{ payload: NewToast }>(),
    addWarning: props<{ payload: NewToast }>(),
    dismiss: props<{ payload: string }>(),
  },
});
