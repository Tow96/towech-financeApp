import { Component } from '@angular/core';
import { DesktopSharedDataAccessToasterService } from '@finance/desktop/shared/data-access-toast';

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
export class DesktopFeatureDashboardShellComponent {
  public constructor(private readonly toastService: DesktopSharedDataAccessToasterService) {}

  public msg() {
    this.toastService.addAccent$.next({ message: 'pesto' });
    this.toastService.addError$.next({ message: 'pesto' });
    this.toastService.addSuccess$.next({ message: 'pesto' });
    this.toastService.addWarning$.next({ message: 'pesto' });
  }
  public err() {
    throw new Error('THIS IS A TEST');
  }
}
