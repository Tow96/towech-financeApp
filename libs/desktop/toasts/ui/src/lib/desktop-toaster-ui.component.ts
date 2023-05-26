/** desktop-toaster-ui.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Dumb component that displays the toast message
 */
// Libraries
import { NgClass } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
// Services
import {
  DesktopToast,
  DesktopToasterService,
  ToastTypes,
} from '@towech-finance/desktop/toasts/data-access';
// Animations
import {
  colorTransition,
  messageBodyTransition,
  messageTextTransition,
} from './desktop-toaster-ui.animations';

@Component({
  standalone: true,
  selector: 'towech-finance-toast',
  imports: [NgClass],
  template: `
    <div class="desktop-toast">
      <div @color [ngClass]="getTypeClass()"></div>
      <div @message_body @message_text class="message">
        {{ toast?.message }}
      </div>
    </div>
  `,
  styleUrls: ['./desktop-toaster-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [colorTransition, messageBodyTransition, messageTextTransition],
})
export class DesktopToastUIComponent implements AfterContentInit {
  @Input() public toast?: DesktopToast;

  public constructor(private readonly toastService: DesktopToasterService) {}

  public ngAfterContentInit(): void {
    if (!this.toast) return;

    setTimeout(() => this.hide(), this.toast.duration || 3000);
  }

  public hide(): void {
    if (!this.toast) return;

    this.toastService.dismiss(this.toast.id);
  }

  public getTypeClass(): Record<string, boolean> {
    return {
      color: true,
      error: this.toast?.type === ToastTypes.ERROR,
      success: this.toast?.type === ToastTypes.SUCCESS,
      warning: this.toast?.type === ToastTypes.WARNING,
    };
  }
}
