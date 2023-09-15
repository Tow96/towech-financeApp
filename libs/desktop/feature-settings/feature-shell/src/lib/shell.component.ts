/** desktop-settings-feature.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main feature component for the settings page
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-settings',
  imports: [],
  template: `<p>DesktopFeatureSettingsShellComponent works</p>`,
})
export class DesktopSettingsComponent {}
