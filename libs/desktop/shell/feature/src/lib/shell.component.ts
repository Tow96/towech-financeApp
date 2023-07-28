/** shell.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that handles the shell's features, such as permanent subscriptions
 */
// Libraries
import { Component, OnDestroy } from '@angular/core';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
import { Subscription } from 'rxjs';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';

@Component({
  standalone: true,
  selector: 'towech-finance-shell',
  imports: [DesktopToasterComponent],
  template: `<towech-finance-toaster></towech-finance-toaster>`,
})
export class DesktopShellComponent implements OnDestroy {
  private userSubscription: Subscription;

  // This ensures some state does not get destroyed if it looses all subscriptions
  // Use only if really needed
  public constructor(private user: DesktopUserService) {
    this.userSubscription = user.store.state$.subscribe();
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
