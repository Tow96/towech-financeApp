/** layout.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main component for the whole application, holds the components that appear globally
 */
// Libraries
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Components
import { DesktopNavbarComponent } from '@towech-finance/desktop/navbar/feature';

// TODO: Add Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-layout',
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
      <towech-finance-webclient-navbar></towech-finance-webclient-navbar>
      <div class="layout__contents">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class LayoutComponent {}
