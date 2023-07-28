import { ToastTypes } from './toast-types.model';

export interface DesktopToast {
  id: string;
  message: string;
  duration?: number;
  type: ToastTypes;
}

export type NewToast = Omit<DesktopToast, 'id' | 'type'>;
