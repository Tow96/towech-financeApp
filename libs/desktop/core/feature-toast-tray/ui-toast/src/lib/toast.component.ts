/** desktop-toaster-ui.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Dumb component that displays the toast message
 */
// Libraries
import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
// Services
import { DesktopToast, ToastTypes } from '@finance/desktop/shared/data-access-toast';
// Animations
import { colorTransition, messageBodyTransition, messageTextTransition } from './toast.animations';

@Component({
  standalone: true,
  selector: 'finance-toast',
  imports: [NgClass],
  template: `
    <div class="desktop-toast">
      <div @color [ngClass]="getTypeClass()"></div>
      <div @message_body @message_text class="message">
        {{ toast?.message }}
      </div>
    </div>
  `,
  styleUrls: ['toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [colorTransition, messageBodyTransition, messageTextTransition],
})
export class DesktopToastComponent implements AfterContentInit {
  private DEFAULTDURATION = 3000;
  @Input() toast?: DesktopToast;
  @Output() dismiss = new EventEmitter<string>();

  ngAfterContentInit(): void {
    if (!this.toast) return;

    setTimeout(() => this.hide(), this.toast.duration || this.DEFAULTDURATION);
  }

  hide(): void {
    if (!this.toast) return;

    this.dismiss.next(this.toast.id);
  }

  getTypeClass(): Record<string, boolean> {
    return {
      color: true,
      error: this.toast?.type === ToastTypes.ERROR,
      success: this.toast?.type === ToastTypes.SUCCESS,
      warning: this.toast?.type === ToastTypes.WARNING,
    };
  }
}
