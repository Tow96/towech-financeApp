// Libraries
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// TODO: Add Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-layout',
  imports: [RouterOutlet],
  // imports: [DesktopNavbarComponent, DesktopToasterComponent, RouterModule],
  styles: [
    `
      .layout {
        display: flex;

        .contents {
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
      <!-- <towech-finance-webclient-navbar></towech-finance-webclient-navbar> -->
      <div class="contents">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  public testhrow() {
    throw new Error('aaaaa');
  }
}
