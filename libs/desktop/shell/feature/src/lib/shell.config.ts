/** shell.config.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main Shell configuration
 */
// Libraries
import { ApplicationConfig, InjectionToken, importProvidersFrom } from '@angular/core';
// Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Services
import { provideRouter } from '@angular/router';
import { devOnlyModulesImport } from '../../imports/dev-only.modules';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { environment } from '../../environments/environment';
import { provideStore } from '@ngrx/store';
// State Adapt
import { adaptReducer } from '@state-adapt/core';

const APP_CONFIG = new InjectionToken('Application config');
export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    provideStore({ adapt: adaptReducer }),
    provideRouter(desktopShellRoutes),
    importProvidersFrom([BrowserAnimationsModule]),
    devOnlyModulesImport,
  ],
};
