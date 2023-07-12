/** desktop-toaster.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service in charge of handling the toast tray
 */
// Libraries
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { BehaviorSubject } from 'rxjs';

export enum ToastTypes {
  ACCENT = 'accent',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}
export interface DesktopToast {
  id: string;
  message: string;
  duration?: number;
  type: ToastTypes;
}

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  private toasts: BehaviorSubject<DesktopToast[]> = new BehaviorSubject<DesktopToast[]>([]);
  public toastTray = this.toasts.asObservable();

  private add(message: string, type: ToastTypes, duration?: number): void {
    const toast = { id: uuid.v4(), message, duration, type };
    this.toasts.next([toast, ...this.toasts.value]);
  }

  public addAccent(message: string, duration?: number): void {
    this.add(message, ToastTypes.ACCENT, duration);
  }

  public addError(message: string, duration?: number): void {
    this.add(message, ToastTypes.ERROR, duration);
  }

  public addSuccess(message: string, duration?: number): void {
    this.add(message, ToastTypes.SUCCESS, duration);
  }

  public addWarning(message: string, duration?: number): void {
    this.add(message, ToastTypes.WARNING, duration);
  }

  public dismiss(id: string) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}
