/** desktop-navbar-ui-item.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that represents the menuitems
 */
// Libraries
import { Component, Input } from '@angular/core';
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
import { menuTransitions } from './desktop-navbar-ui-item.animations';

@Component({
  standalone: true,
  selector: 'towech-finance-navbar-item',
  imports: [FontAwesomeModule, NgIf],
  styleUrls: ['desktop-navbar-ui-item.component.scss'],
  template: `
    <button>
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
  @Input() public label = '';
  @Input() public icon: IconProp = 'right-from-bracket';
  @Input() public collapsed = true;

  public constructor(private readonly library: FaIconLibrary) {
    library.addIcons(faBars, faRightFromBracket, faGear, faMoneyCheckDollar);
  }
}
