import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesktopToasterComponent } from '@towech-finance/desktop/toaster/feature';
import { DesktopToasterService } from '@towech-finance/desktop/toaster/data-access';

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-layout',
  imports: [DesktopToasterComponent, RouterModule],
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {
  constructor(private readonly toaster: DesktopToasterService) {}
}
