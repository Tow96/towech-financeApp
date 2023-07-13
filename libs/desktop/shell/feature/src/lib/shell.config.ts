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
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/error';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { environment } from '../../environments/environment';
import { provideStore } from '@ngrx/store';
// State Adapt
import { adaptReducer } from '@state-adapt/core';
import { DesktopUserAuthGuard } from '@towech-finance/desktop/user/guards';

const APP_CONFIG = new InjectionToken('Application config');
export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    // Environment
    { provide: APP_CONFIG, useValue: environment },
    // Old Modules
    importProvidersFrom([BrowserAnimationsModule]),
    // Store
    provideStore({ adapt: adaptReducer }),
    // Routes
    provideRouter(desktopShellRoutes),
    // Global Toaster
    DesktopGlobalErrorToast,
    // User
    DesktopUserService,
    DesktopUserAuthGuard,
    // DEV ONLY
    devOnlyModulesImport,
  ],
};
