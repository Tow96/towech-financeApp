import { of } from 'rxjs';
import { DesktopSharedDataAccessToasterService } from '@finance/desktop/shared/data-access-toast';

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

export const DesktopSharedDataAccessToasterServiceMock = {
  provide: DesktopSharedDataAccessToasterService,
  useValue: mockValues,
};
