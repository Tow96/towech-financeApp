/** shell.config.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main Shell configuration
 */
// Libraries
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Services
import { provideRouter } from '@angular/router';
import { devOnlyModulesImport } from '../../imports/dev-only.modules';
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/error';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
import { provideHttpClient } from '@angular/common/http';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { provideEnvironment } from '@towech-finance/desktop/environment';
import { provideStore } from '@ngrx/store';
// State Adapt
import { adaptReducer } from '@state-adapt/core';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@towech-finance/desktop/user/guards';

export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    // Environment
    provideEnvironment(),
    // Old Modules
    importProvidersFrom([BrowserAnimationsModule]),
    // Http
    provideHttpClient(),
    // Store
    provideStore({ adapt: adaptReducer }),
    // Routes
    provideRouter(desktopShellRoutes),
    // Global Toaster
    DesktopGlobalErrorToast,
    // User
    DesktopUserService,
    DesktopUserAuthGuard,
    DesktopUserNoAuthGuard,
    // DEV ONLY
    devOnlyModulesImport,
  ],
};
