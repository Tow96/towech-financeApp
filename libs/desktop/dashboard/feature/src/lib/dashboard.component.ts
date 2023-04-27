import { Component } from '@angular/core';
import { DesktopToasterService } from '@towech-finance/desktop/toaster/feature';

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  template: ` <button (click)="msg()">aaaa</button> `,
})
export class DesktopDashboardComponent {
  constructor(private readonly toastService: DesktopToasterService) {}

  msg() {
    this.toastService.addToast('pesto');
  }
}
