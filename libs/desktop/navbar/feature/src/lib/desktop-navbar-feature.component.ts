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
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
// Components
import { DesktopNavbarItemComponent } from '@towech-finance/desktop/navbar/ui/item';
// Models
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
  selector: 'towech-finance-webclient-navbar',
  imports: [AsyncPipe, DesktopNavbarItemComponent, NgFor, NgClass, NgIf],
  styleUrls: ['./desktop-navbar-feature.component.scss'],
  templateUrl: `./desktop-navbar-feature.component.html`,
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
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.forceCollapse$.next();
    }
  }

  // Pipes --------------------------------------------------------------------
  private forceCollapse$ = new Source<void>('[Navbar] Collapse drawer');
  public toggleCollapse$ = new Source<void>('[Navbar] Toggle drawer');
  public navigateTo$ = new Source<string>('[Navbar] Navigate to');

  // Adapter ------------------------------------------------------------------
  private adapter = createAdapter<state>()({
    forceCollapse: state => ({ ...state, collapsed: true }),
    toggleCollapse: state => ({ ...state, collapsed: !state.collapsed }),
    navigateTo: (state, route: string) => this.navigateTo(state, route),
    selectors: {
      isCollapsed: state => state.collapsed,
      items: state => state.items,
    },
  });

  // Store --------------------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    forceCollapse: this.forceCollapse$,
    toggleCollapse: this.toggleCollapse$,
    navigateTo: this.navigateTo$,
  });

  // Helpers ------------------------------------------------------------------
  private navigateTo(state: state, route: string): state {
    this.router.navigate([route]);
    return { ...state, collapsed: true };
  }

  public setItemId(index: number): string {
    return `${this.storeName}-${index}`;
  }

  public getNavClass(collapsed: boolean): Record<string, boolean> {
    return {
      deployed: !collapsed,
    };
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
