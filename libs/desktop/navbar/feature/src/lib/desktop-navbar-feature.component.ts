/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
// Modules
import { NgFor } from '@angular/common';
// NGRX
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';
// Components
import { DesktopNavbarItemComponent } from '@towech-finance/desktop/navbar/ui/item';
// Models
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface NavIcon {
  title: string;
  icon: IconProp;
  route: string;
}

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-navbar',
  imports: [DesktopNavbarItemComponent, NgFor],
  styleUrls: ['./desktop-navbar-feature.component.scss'],
  template: `
    <div class="nav-wrapper">
      <nav>
        <!-- Menu toggle -->
        <towech-finance-navbar-item
          (clicked)="onToggleCollapse()"
          label="Close"
          [collapsed]="collapsed"
          icon="bars"></towech-finance-navbar-item>
        <div class="nav__divider"></div>
        <!-- Menu items -->
        <div class="nav__contents">
          <towech-finance-navbar-item
            *ngFor="let item of items"
            [label]="item.title"
            [collapsed]="collapsed"
            [icon]="item.icon"
            (clicked)="navigateTo(item.route)"></towech-finance-navbar-item>
        </div>
        <!-- Logout -->
        <div class="nav__divider"></div>
        <div>
          <towech-finance-navbar-item
            (clicked)="onLogoutClick()"
            label="Logout"
            [collapsed]="collapsed"></towech-finance-navbar-item>
        </div>
      </nav>
    </div>
  `,
})
export class DesktopNavbarComponent {
  public items: NavIcon[] = [
    { title: 'Transactions', icon: 'money-check-dollar', route: '' },
    { title: 'Settings', icon: 'gear', route: 'settings' },
  ];
  public collapsed = false;

  public constructor(private readonly store: Store, private readonly router: Router) {}

  public onLogoutClick(): void {
    this.store.dispatch(UserActions.logout());
  }

  public onToggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
