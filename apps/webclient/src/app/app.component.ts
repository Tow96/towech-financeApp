// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
// Components
import { ToastComponent } from './toasttest/toast.component';
import { DesktopShellModule } from '@towech-finance/desktop/shell/feature';
import { DesktopToasterService } from '@towech-finance/desktop/toaster/feature';

@Component({
  standalone: true,
  imports: [ToastComponent, DesktopShellModule],
  selector: 'webclient-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'webclient';
  constructor(private readonly a: DesktopToasterService) {}

  test(msg: string) {
    this.a.addToast(msg, 60000);
  }
}
