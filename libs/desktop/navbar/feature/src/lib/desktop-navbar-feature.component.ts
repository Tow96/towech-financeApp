/** desktop-navbar-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar for the complete app
 */
// Libraries
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
// Modules
import { NgClass, NgFor } from '@angular/common';
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

// TODO: Make declarative rather than imperative
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-navbar',
  imports: [DesktopNavbarItemComponent, NgFor, NgClass],
  styleUrls: ['./desktop-navbar-feature.component.scss'],
  templateUrl: `./desktop-navbar-feature.component.html`,
})
export class DesktopNavbarComponent {
  public items: NavIcon[] = [
    { title: 'Transactions', icon: 'money-check-dollar', route: '' },
    { title: 'Settings', icon: 'gear', route: 'settings' },
  ];
  public collapsed = true;

  public constructor(
    private readonly router: Router,
    public readonly user: DesktopUserService,
    public eRef: ElementRef
  ) {}

  public onToggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
    this.collapsed = true;
  }

  public isRouteActive(route: string): boolean {
    const currentRoute = this.router.url.slice(1);
    return route === currentRoute;
  }

  @HostListener('document:click', ['$event'])
  public clickListener(event: PointerEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.collapsed = true;
    }
  }

  public getNavClass(): Record<string, boolean> {
    return {
      deployed: !this.collapsed,
    };
  }
}
