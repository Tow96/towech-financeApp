import { Component } from '@angular/core';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  template: ` <button (click)="msg()">aaaa</button> <button (click)="err()">bbbb</button>`,
})
export class DesktopDashboardComponent {
  public constructor(private readonly toastService: DesktopToasterService) {}

  public msg() {
    this.toastService.add('pesto');
  }
  public err() {
    throw new Error('THIS IS A TEST');
  }
}
