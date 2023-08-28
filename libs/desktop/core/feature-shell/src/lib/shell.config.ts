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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { devOnlyModulesImport } from '@finance/desktop/core/utils-imports';
import { DesktopErrorInterceptor } from '@finance/desktop/core/utils-interceptors';
import { DesktopUserService, refreshInterceptor } from '@finance/desktop/shared/data-access-user';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
// Routes
import { desktopShellRoutes } from './desktop-shell.routes';
// Environment
import { provideDesktopEnvironment } from '@finance/desktop/shared/utils-environments';
// Guards
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';

export const DesktopShellConfig: ApplicationConfig = {
  providers: [
    // Environment
    provideDesktopEnvironment(),
    // Old Modules
    importProvidersFrom([BrowserAnimationsModule]),
    // Http
    provideHttpClient(withInterceptors([refreshInterceptor])),
    // Store
    provideStore(),
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
