import { AfterContentInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DesktopToast, DesktopToasterService } from './desktop-toaster.service';

@Component({
  standalone: true,
  selector: 'towech-finance-toast',
  template: ` <div class="desktop-toast">{{ toast?.message }}</div> `,
  styleUrls: ['./desktop-toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopToastComponent implements AfterContentInit {
  @Input() toast?: DesktopToast;

  constructor(private readonly toastService: DesktopToasterService) {}

  ngAfterContentInit(): void {
    if (!this.toast) return;

    setTimeout(() => this.hide(), this.toast.duration || 3000);
  }

  hide() {
    if (!this.toast) return;

    this.toastService.dismiss(this.toast.id);
  }
}
