/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// Modules
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Components
import { DesktopNavbarItemComponent } from '@finance/desktop/core/navbar/ui-item';
// Utils
import { getTitleFromRoute, navBarActions, navContents, state } from './utils';
import { ReducerManager, Store, createFeature, createReducer, on } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'finance-navbar',
  imports: [AsyncPipe, DesktopNavbarItemComponent, NgFor, NgClass, NgIf],
  styleUrls: ['navbar.component.scss'],
  templateUrl: `navbar.component.html`,
})
export class DesktopNavbarComponent implements OnDestroy {
  private initialState: state = {
    collapsed: true,
    items: navContents,
    title: getTitleFromRoute(navContents, this.router.url.slice(1)),
  };
  private state = createFeature({
    name: 'navbar',
    reducer: createReducer(
      this.initialState,
      on(navBarActions.toggleCollapse, state => ({ ...state, collapsed: !state.collapsed })),
      on(navBarActions.forceCollapse, state => ({ ...state, collapsed: true })),
      on(navBarActions.changeTitle, (state, { payload }) => ({
        ...state,
        title: getTitleFromRoute(state.items, payload),
      }))
    ),
  });

  // Listeners ----------------------------------------------------------------
  @HostListener('document:click', ['$event'])
  clickListener(event: PointerEvent): void {
    const refContainsTarget: boolean = this.eRef.nativeElement.contains(event.target);
    const refIsDeployed = this.eRef.nativeElement.querySelector('.deployed') !== null;

    if (refIsDeployed && !refContainsTarget) this.forceCollapse();
  }

  // Sources ------------------------------------------------------------------
  private forceCollapse = () => this.ngrx.dispatch(navBarActions.forceCollapse());
  toggleCollapse = () => this.ngrx.dispatch(navBarActions.toggleCollapse());
  selectTitle = (payload: string) => this.ngrx.dispatch(navBarActions.changeTitle({ payload }));
  // TODO: Make this an effect
  navigateTo = (route: string) => {
    this.selectTitle(route);
    this.router.navigate([route]);
    this.forceCollapse();
  };

  // Selectors ----------------------------------------------------------------
  isCollapsed$ = this.ngrx.select(this.state.selectCollapsed);
  items$ = this.ngrx.select(this.state.selectItems);
  title$ = this.ngrx.select(this.state.selectTitle);

  // HTML Helpers -------------------------------------------------------------
  setItemId(route: string): string {
    return `${this.state.name}-${route}`;
  }
  getNavClass(collapsed: boolean): Record<string, boolean> {
    return { deployed: !collapsed };
  }
  isRouteActive(route: string): boolean {
    const currentRoute = this.router.url.slice(1);
    return route === currentRoute;
  }

  constructor(
    private readonly ngrx: Store,
    private readonly eRef: ElementRef,
    private readonly router: Router,
    readonly user: DesktopUserService,
    private readonly reducers: ReducerManager
  ) {
    reducers.addReducer(this.state.name, this.state.reducer);
  }
  ngOnDestroy(): void {
    this.reducers.removeReducer(this.state.name);
  }
}
