import { Component } from '@angular/core';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'finance-dashboard',
  styles: [
    `
      .pesto {
        background-color: pink !important;
      }
    `,
  ],
  template: `
    <div class="pesto">
      <button (click)="msg()">aaaa</button> <button (click)="err()">bbbb</button>
    </div>
  `,
})
export class DesktopDashboardComponent {
  constructor(private readonly toastService: DesktopToasterService) {}

  msg() {
    this.toastService.addAccent('pesto');
    this.toastService.addError('pesto');
    this.toastService.addSuccess('pesto');
    this.toastService.addWarning('pesto');
  }
  err() {
    throw new Error('THIS IS A TEST');
  }
}
