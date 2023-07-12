/** desktop-toast.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that holds the entire toast tray
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
// Services
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
// Components
import { DesktopToastUIComponent } from '@towech-finance/desktop/toasts/ui';
// Animations
import { toastTransition } from './desktop-toast.animations';

@Component({
  standalone: true,
  selector: 'towech-finance-toaster',
  imports: [AsyncPipe, NgFor, DesktopToastUIComponent],
  template: `
    <div class="desktop-toaster">
      <towech-finance-toast
        @toast
        *ngFor="let toast of service.toastTray | async"
        [toast]="toast"></towech-finance-toast>
    </div>
  `,
  styleUrls: ['./desktop-toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [toastTransition],
})
export class DesktopToasterComponent {
  public constructor(public readonly service: DesktopToasterService) {}
}
