// Libraries
import { Component } from '@angular/core';
// Modules
// import { RouterModule } from '@angular/router';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';
// import { DesktopNavbarComponent } from '@towech-finance/desktop/navbar/feature';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-layout',
  imports: [DesktopToasterComponent],
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
    <towech-finance-toaster></towech-finance-toaster>
    <div class="layout">
      <button (click)="testhrow()">throw</button>
      <!-- <towech-finance-webclient-navbar></towech-finance-webclient-navbar> -->
      <div class="contents">
        <!-- <router-outlet></router-outlet> -->
      </div>
    </div>
  `,
})
export class LayoutComponent {
  public testhrow() {
    throw new Error('aaaaa');
  }
}
