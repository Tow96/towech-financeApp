/** desktop-toast.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that holds the entire toast tray
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
// Services
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Components
import { DesktopToastComponent } from '@finance/desktop/core/toast-tray/ui-toast';
// Animations
import { toastTransition } from './tray.animations';

@Component({
  standalone: true,
  selector: 'finance-toast-tray',
  imports: [AsyncPipe, NgFor, DesktopToastComponent],
  styles: [
    `
      .desktop-toaster {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2rem;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        overflow-x: hidden;
        z-index: 999;
      }
    `,
  ],
  template: `
    <div class="desktop-toaster">
      <finance-toast
        @toast
        *ngFor="let toast of service.tray$ | async"
        [toast]="toast"
        (dismiss)="service.dismiss($event)">
      </finance-toast>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [toastTransition],
})
export class DesktopToastTrayComponent {
  constructor(readonly service: DesktopToasterService) {}
}
