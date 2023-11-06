export enum ToastTypes {
  ACCENT = 'accent',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export type DesktopToast = {
  id: string;
  message: string;
  duration?: number;
  type: ToastTypes;
};

export type NewToast = Omit<DesktopToast, 'id' | 'type'>;
