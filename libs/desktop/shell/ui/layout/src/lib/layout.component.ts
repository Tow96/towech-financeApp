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
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <towech-finance-webclient-navbar></towech-finance-webclient-navbar>
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {}
