/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';

// Libraries
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-navbar',
  imports: [],
  styleUrls: ['./desktop-navbar-feature.component.scss'],
  template: `<button (click)="onLogoutClick()">Logout</button>`,
})
export class DesktopNavbarComponent {
  public constructor(private readonly store: Store) {}

  public onLogoutClick() {
    this.store.dispatch(UserActions.logout());
  }
}
