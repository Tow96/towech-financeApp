/** layout.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main component for the whole application, holds the components that appear globally
 */
// Libraries
import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { debounceTime, filter, map } from 'rxjs';
// Components
import { DesktopNavbarComponent } from '@finance/desktop/core/navbar/shell';
import { DesktopSpinnerComponent } from '@finance/desktop/shared/ui-spinner';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'finance-layout',
  imports: [AsyncPipe, NgIf, DesktopSpinnerComponent, DesktopNavbarComponent, RouterModule],
  styleUrls: ['layout.component.scss'],
  template: `
    <div class="layout">
      <finance-navbar></finance-navbar>
      <div class="layout__contents">
        <!-- <div *ngIf="isRouterLoading$ | async">a</div> -->
        <finance-spinner size="8rem" *ngIf="isRouterLoading$ | async"></finance-spinner>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class DesktopLayoutComponent {
  public isRouterLoading$ = this.router.events.pipe(
    filter(
      e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
    ),
    debounceTime(20),
    map(e => e instanceof NavigationStart)
  );

  public constructor(private readonly router: Router) {}
}
