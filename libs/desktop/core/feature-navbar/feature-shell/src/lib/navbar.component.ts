/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, toSource } from '@state-adapt/rxjs';
// Modules
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Components
import { DesktopNavbarItemComponent } from '@finance/desktop/core/navbar/ui-item';
// Models
import { filter, map, tap } from 'rxjs';
// Utils
import { adapter, getTitleFromRoute, navContents, state } from './utils';

@Component({
  standalone: true,
  selector: 'finance-navbar',
  imports: [AsyncPipe, DesktopNavbarItemComponent, NgFor, NgClass, NgIf],
  styleUrls: ['navbar.component.scss'],
  templateUrl: `navbar.component.html`,
})
export class DesktopNavbarComponent {
  private storeName = 'navbar';
  private initialState: state = {
    collapsed: true,
    items: navContents,
    title: getTitleFromRoute(navContents, this.router.url.slice(1)),
  };

  // Listeners ----------------------------------------------------------------
  @HostListener('document:click', ['$event'])
  public clickListener(event: PointerEvent): void {
    const refContainsTarget: boolean = this.eRef.nativeElement.contains(event.target);
    const refIsDeployed = this.eRef.nativeElement.querySelector('.deployed') !== null;

    if (refIsDeployed && !refContainsTarget) this.forceCollapse$.next();
  }

  // Sources ------------------------------------------------------------------
  private forceCollapse$ = new Source<void>('[Navbar] Collapse drawer');
  public toggleCollapse$ = new Source<void>('[Navbar] Toggle drawer');
  public navigateTo$ = new Source<string>('[Navbar] Navigate to');

  // Pipes --------------------------------------------------------------------
  private handleNavigate$ = this.navigateTo$.pipe(
    tap(({ payload }) => this.router.navigate([payload]))
  );
  private changeTitle$ = this.router.events.pipe(
    filter(nav => nav instanceof NavigationEnd),
    map((nav: any) => nav.url.substring(1)), // eslint-disable-line @typescript-eslint/no-explicit-any
    toSource('[Navbar] Change Title')
  );

  // Store --------------------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, adapter], {
    changeTitle$: this.changeTitle$,
    forceCollapse: [this.forceCollapse$, this.handleNavigate$],
    toggleCollapse: this.toggleCollapse$,
  });

  // HTML Helpers -------------------------------------------------------------
  public setItemId(route: string): string {
    return `${this.storeName}-${route}`;
  }
  public getNavClass(collapsed: boolean): Record<string, boolean> {
    return { deployed: !collapsed };
  }
  public isRouteActive(route: string): boolean {
    const currentRoute = this.router.url.slice(1);
    return route === currentRoute;
  }

  public constructor(
    private readonly router: Router,
    public readonly user: DesktopUserService,
    public eRef: ElementRef
  ) {}
}
