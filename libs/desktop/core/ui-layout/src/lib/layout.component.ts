/** layout.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main component for the whole application, holds the components that appear globally
 */
// Libraries
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Components
import { DesktopNavbarComponent } from '@finance/desktop/core/feature-navbar';

// TODO: Add Testing
@Component({
  standalone: true,
  selector: 'finance-layout',
  imports: [DesktopNavbarComponent, RouterOutlet],
  styles: [
    `
      .layout {
        display: flex;

        .layout__contents {
          flex: 1;
          margin: 1em;
        }

        @media screen and (max-width: 30em) {
          flex-direction: column;
        }
      }
    `,
  ],
  template: `
    <div class="layout">
      <finance-navbar></finance-navbar>
      <div class="layout__contents">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class DesktopLayoutComponent {}
