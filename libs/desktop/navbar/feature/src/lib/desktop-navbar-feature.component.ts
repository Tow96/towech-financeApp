/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
// Modules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// NGRX
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';
// Components
import { DesktopNavbarItemComponent } from '@towech-finance/desktop/navbar/ui/item';
// icons
import { faCircleUp, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

// Libraries
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-navbar',
  imports: [FontAwesomeModule, DesktopNavbarItemComponent],
  styleUrls: ['./desktop-navbar-feature.component.scss'],
  template: `
    <nav>
      <div>
        <div>
          <fa-icon icon="circle-up"></fa-icon>
        </div>
        <div>
          <fa-icon icon="circle-up"></fa-icon>
        </div>
      </div>
      <div>
        <towech-finance-navbar-item></towech-finance-navbar-item>
        <!-- <div class="pesto" (click)="onLogoutClick()">
          <fa-icon icon="right-from-bracket"></fa-icon>
          This is a test
        </div> -->
      </div>
    </nav>
  `,
})
export class DesktopNavbarComponent {
  public sidebar = false;

  public constructor(private readonly store: Store, private readonly library: FaIconLibrary) {
    library.addIcons(faCircleUp, faRightFromBracket);
  }

  public onLogoutClick() {
    this.store.dispatch(UserActions.logout());
  }

  public setSidebar() {
    this.sidebar = true;
  }
}
