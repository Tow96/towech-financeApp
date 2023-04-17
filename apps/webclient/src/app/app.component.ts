import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DesktopShellModule } from '@towech-finance/desktop/shell/feature';

@Component({
  selector: 'webclient-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
