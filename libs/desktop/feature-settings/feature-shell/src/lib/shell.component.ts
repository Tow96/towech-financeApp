/** desktop-settings-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main feature component for the settings page
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
// Components
import { DesktopSettingsUiUserFormComponent } from '@finance/desktop/settings/ui-user-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-settings',
  styles: [
    `
      .settings-screen {
        padding-left: 1.5rem;
      }
    `,
  ],
  imports: [DesktopSettingsUiUserFormComponent],
  template: `<div class="settings-screen">
    <finance-desktop-settings-ui-user-form></finance-desktop-settings-ui-user-form>
  </div> `,
})
export class DesktopSettingsComponent {}
