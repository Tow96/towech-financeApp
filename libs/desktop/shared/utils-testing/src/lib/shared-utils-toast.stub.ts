import { ToastTypes } from '@finance/desktop/shared/utils-types';

export const stubAccentToast = () => ({
  id: '-0',
  message: 'ADD TEST 0',
  type: ToastTypes.ACCENT,
});

export const stubErrorToast = () => ({
  id: '-1',
  message: 'Toast content',
  type: ToastTypes.ERROR,
});

export const stubSuccessToast = () => ({
  id: '-2',
  message: 'Toast content',
  type: ToastTypes.SUCCESS,
});

export const stubWarningToast = () => ({
  id: '-3',
  message: 'Toast content',
  type: ToastTypes.WARNING,
});
