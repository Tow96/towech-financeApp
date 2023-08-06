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
import { devOnlyModulesImport } from '@finance/desktop/core/utils-imports';
import { DesktopGlobalErrorToast } from '@finance/desktop/core/utils-interceptors';
import { DesktopSharedDataAccessUserService } from '@finance/desktop/shared/data-access-user';
import { provideHttpClient } from '@angular/common/http';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { provideDesktopSharedEnvironment } from '@finance/desktop/shared/utils-environments';
import { provideStore } from '@ngrx/store';
// State Adapt
import { adaptReducer } from '@state-adapt/core';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';

export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    // Environment
    provideDesktopSharedEnvironment(),
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
    DesktopSharedDataAccessUserService,
    DesktopUserAuthGuard,
    DesktopUserNoAuthGuard,
    // DEV ONLY
    devOnlyModulesImport,
  ],
};
