import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { DesktopToastUIComponent } from '@towech-finance/desktop/toasts/ui';

@Component({
  standalone: true,
  selector: 'towech-finance-toaster',
  imports: [AsyncPipe, NgFor, DesktopToastUIComponent],
  template: `
    <div class="desktop-toaster">
      <towech-finance-toast
        *ngFor="let toast of service.toastTray | async"
        [toast]="toast"></towech-finance-toast>
    </div>
  `,
  styleUrls: ['./desktop-toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopToasterComponent {
  public constructor(public readonly service: DesktopToasterService) {}
}
