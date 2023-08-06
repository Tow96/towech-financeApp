import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesktopShellComponent } from '@finance/desktop/core/feature-shell';

@Component({
  standalone: true,
  selector: 'webclient-root',
  imports: [DesktopShellComponent, RouterOutlet],
  template: '<towech-finance-shell></towech-finance-shell><router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
