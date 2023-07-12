import { NgModule } from '@angular/core';
import { environment } from './environments/environment';

import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken('Application config');

@NgModule({
  providers: [{ provide: APP_CONFIG, useValue: environment }],
})
export class DesktopShellUtilsEnvironmentsModule {}
