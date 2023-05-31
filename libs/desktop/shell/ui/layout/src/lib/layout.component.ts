// Libraries
import { Component } from '@angular/core';
// Modules
import { RouterModule } from '@angular/router';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';
import { DesktopNavbarComponent } from '@towech-finance/desktop/navbar/feature';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-layout',
  imports: [DesktopNavbarComponent, DesktopToasterComponent, RouterModule],
  styleUrls: ['layout.component.scss'],
  template: `
    <div class="layout">
      <towech-finance-webclient-navbar class="nav"></towech-finance-webclient-navbar>
      <div class="header">TODO: HEADER</div>
      <div class="content">
        <towech-finance-toaster></towech-finance-toaster>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class LayoutComponent {}
