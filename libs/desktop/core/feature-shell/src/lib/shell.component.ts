/** shell.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that handles the shell's features, such as permanent subscriptions
 */
// Libraries
import { Component } from '@angular/core';
// Components
import { DesktopToastTrayComponent } from '@finance/desktop/core/toast-tray';

@Component({
  standalone: true,
  selector: 'finance-shell',
  imports: [DesktopToastTrayComponent],
  template: `<finance-toast-tray></finance-toast-tray>`,
})
// TODO: fix
export class DesktopShellComponent {}
