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
import { DesktopErrorInterceptor } from '@finance/desktop/core/utils-interceptors';
import { DesktopUserService, refreshInterceptor } from '@finance/desktop/shared/data-access-user';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { provideDesktopEnvironment } from '@finance/desktop/shared/utils-environments';
import { provideStore } from '@ngrx/store';
// State Adapt
import { adaptReducer } from '@state-adapt/core';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';
import { provideEffects } from '@ngrx/effects';

export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    // Environment
    provideDesktopEnvironment(),
    // Old Modules
    importProvidersFrom([BrowserAnimationsModule]),
    // Http
    provideHttpClient(withInterceptors([refreshInterceptor])),
    // Store
    provideStore({ adapt: adaptReducer }),
    provideEffects(),
    // Routes
    provideRouter(desktopShellRoutes),
    // Global Toaster
    DesktopErrorInterceptor,
    // User
    DesktopUserService,
    DesktopUserAuthGuard,
    DesktopUserNoAuthGuard,
    // DEV ONLY
    devOnlyModulesImport,
  ],
};
