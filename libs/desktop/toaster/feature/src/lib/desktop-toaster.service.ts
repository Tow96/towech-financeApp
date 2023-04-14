import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DesktopToast {
  id: number;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  toastTray: BehaviorSubject<DesktopToast[]> = new BehaviorSubject<DesktopToast[]>([]);

  addToast(message: string, duration?: number): void {
    const toast = { id: new Date().getTime(), message, duration };
    this.toastTray.next([toast, ...this.toastTray.value]);
  }

  dismiss(id: number) {
    this.toastTray.next(this.toastTray.value.filter(t => t.id != id));
  }
}
