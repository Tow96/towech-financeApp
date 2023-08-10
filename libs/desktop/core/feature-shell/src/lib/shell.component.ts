/** shell.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that handles the shell's features, such as permanent subscriptions
 */
// Libraries
import { Component, OnDestroy } from '@angular/core';
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
import { Subscription } from 'rxjs';
// Components
import { DesktopToastTrayComponent } from '@finance/desktop/core/feature-toast-tray';

@Component({
  standalone: true,
  selector: 'finance-shell',
  imports: [DesktopToastTrayComponent],
  template: `<finance-toast-tray></finance-toast-tray>`,
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
