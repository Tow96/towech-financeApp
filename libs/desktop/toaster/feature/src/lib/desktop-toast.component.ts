import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { DesktopToasterService } from './desktop-toaster.service';
import { DesktopToastComponent } from './toast.component';

@Component({
  standalone: true,
  selector: 'towech-finance-toaster',
  imports: [AsyncPipe, NgFor, DesktopToastComponent],
  template: `<div class="desktop-toaster">
    <towech-finance-toast
      *ngFor="let toast of service.toastTray | async"
      [toast]="toast"></towech-finance-toast>
  </div> `,
  styleUrls: ['./desktop-toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopToasterComponent {
  constructor(public readonly service: DesktopToasterService) {}
}
