import { of } from 'rxjs';

import {
  stubAccentToast,
  stubErrorToast,
  stubSuccessToast,
  stubWarningToast,
} from './shared-utils-toast.stub';
import { Source } from '@state-adapt/rxjs';

export const DesktopToasterServiceMock = {
  addError$: new Source<any>('Test Error Toast'),
  toasts: {
    state$: of([stubWarningToast(), stubSuccessToast(), stubErrorToast(), stubAccentToast()]),
  },
};
