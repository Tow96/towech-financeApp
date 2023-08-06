import { of } from 'rxjs';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';

import {
  stubAccentToast,
  stubErrorToast,
  stubSuccessToast,
  stubWarningToast,
} from './shared-utils-toast.stub';
import { Source } from '@state-adapt/rxjs';

const mockValues = {
  addError$: new Source<any>('Test Error Toast'),
  toasts: {
    state$: of([stubWarningToast(), stubSuccessToast(), stubErrorToast(), stubAccentToast()]),
  },
};

export const DesktopToasterServiceMock = {
  provide: DesktopToasterService,
  useValue: mockValues,
};
