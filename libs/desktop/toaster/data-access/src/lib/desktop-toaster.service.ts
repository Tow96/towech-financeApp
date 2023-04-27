import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DesktopToast {
  id: number;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  private toasts: BehaviorSubject<DesktopToast[]> = new BehaviorSubject<DesktopToast[]>([]);

  public toastTray = this.toasts.asObservable();

  public addToast(message: string, duration?: number): void {
    const toast = { id: new Date().getTime(), message, duration };
    this.toasts.next([toast, ...this.toasts.value]);
  }

  public dismiss(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id != id));
  }
}
