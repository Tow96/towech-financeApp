import { of } from 'rxjs';

import {
  stubAccentToast,
  stubErrorToast,
  stubSuccessToast,
  stubWarningToast,
} from './shared-utils-toast.stub';

export const DesktopToasterServiceMock = {
  addError: () => {}, //eslint-disable-line
  addWarning: () => {}, //eslint-disable-line
  tray$: of([stubWarningToast(), stubSuccessToast(), stubErrorToast(), stubAccentToast()]),
};
