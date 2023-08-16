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
    this.toastService.addAccent$.next({ message: 'pesto' });
    this.toastService.addError$.next({ message: 'pesto' });
    this.toastService.addSuccess$.next({ message: 'pesto' });
    this.toastService.addWarning$.next({ message: 'pesto' });
  }
  err() {
    throw new Error('THIS IS A TEST');
  }
}
