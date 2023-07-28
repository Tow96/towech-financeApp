import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesktopShellComponent } from '@towech-finance/desktop/shell/feature';
// import { DesktopUserService } from '@towech-finance/desktop/user/data-access';

@Component({
  standalone: true,
  selector: 'webclient-root',
  imports: [DesktopShellComponent, RouterOutlet],
  template: '<towech-finance-shell></towech-finance-shell><router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
