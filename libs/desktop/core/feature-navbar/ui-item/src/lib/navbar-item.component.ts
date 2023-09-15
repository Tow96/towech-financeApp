/** desktop-navbar-ui-item.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that represents the menuitems
 */
// Libraries
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
// Modules
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// icons
import {
  faBars,
  faGear,
  faRightFromBracket,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { menuTransitions } from './navbar-item.animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-navbar-item',
  imports: [FontAwesomeModule, NgIf],
  styleUrls: [`navbar-item.component.scss`],
  template: `
    <button [disabled]="active" (click)="clicked.next()">
      <div>
        <fa-icon [icon]="icon" size="2x" [fixedWidth]="true"></fa-icon>
        <div class="label" *ngIf="!collapsed" @pesto>
          {{ label }}
        </div>
      </div>
    </button>
  `,
  animations: [menuTransitions],
})
export class DesktopNavbarItemComponent {
  @Input() label = '';
  @Input() icon: IconProp = 'right-from-bracket';
  @Input() collapsed = true;
  @Input() active = false;
  @Output() clicked = new EventEmitter<void>();

  constructor(private readonly library: FaIconLibrary) {
    library.addIcons(faBars, faRightFromBracket, faGear, faMoneyCheckDollar);
  }
}
