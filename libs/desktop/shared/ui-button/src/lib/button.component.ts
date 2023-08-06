/** shared-ui-button.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom Button Component
 */
// Libraries
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'finance-button',
  styleUrls: ['button.component.scss'],
  template: `<button [className]="color" [type]="type"><ng-content></ng-content></button>`,
})
export class DesktopButtonComponent {
  @Input() public type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
  @Input() public color: 'accent' | 'success' | 'error' | 'warning' = 'accent';
}
