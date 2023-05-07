/** desktop-toaster.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service in charge of handling the toast tray
 */
// Libraries
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { BehaviorSubject } from 'rxjs';

export interface DesktopToast {
  id: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  private toasts: BehaviorSubject<DesktopToast[]> = new BehaviorSubject<DesktopToast[]>([]);

  public toastTray = this.toasts.asObservable();

  public add(message: string, duration?: number): void {
    const toast = { id: uuid.v4(), message, duration };
    this.toasts.next([toast, ...this.toasts.value]);
  }

  public dismiss(id: string) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}
