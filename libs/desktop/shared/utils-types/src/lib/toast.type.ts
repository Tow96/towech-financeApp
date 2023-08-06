import { ToastTypes } from './toast-types.enum';

export type DesktopToast = {
  id: string;
  message: string;
  duration?: number;
  type: ToastTypes;
};

export type NewToast = Omit<DesktopToast, 'id' | 'type'>;
