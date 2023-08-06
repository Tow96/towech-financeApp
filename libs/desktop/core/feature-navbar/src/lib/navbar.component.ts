/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source } from '@state-adapt/rxjs';
// Modules
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Components
import { DesktopNavbarItemComponent } from '@finance/desktop/core/ui-navbar-item';
// Models
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { tap } from 'rxjs';

interface NavIcon {
  title: string;
  icon: IconProp;
  route: string;
}
interface state {
  collapsed: boolean;
  items: NavIcon[];
}

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
    items: [
      { title: 'Transactions', icon: 'money-check-dollar', route: '' },
      { title: 'Settings', icon: 'gear', route: 'settings' },
    ],
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

  // Adapter ------------------------------------------------------------------
  private adapter = createAdapter<state>()({
    forceCollapse: state => ({ ...state, collapsed: true }),
    toggleCollapse: state => ({ ...state, collapsed: !state.collapsed }),
    selectors: {
      isCollapsed: state => state.collapsed,
      items: state => state.items,
    },
  });

  // Store --------------------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    forceCollapse: [this.forceCollapse$, this.handleNavigate$],
    toggleCollapse: this.toggleCollapse$,
  });

  // Helpers ------------------------------------------------------------------
  public setItemId(index: number): string {
    return `${this.storeName}-${index}`;
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
