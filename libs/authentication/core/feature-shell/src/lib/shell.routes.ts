/** shell.routes.ts
 * Copyright (c) 2023, Towechlabs
 *
 * File that handles all the http routes for the service
 */
// Libraries
import { Routes } from '@nestjs/core';
// Modules
import { AuthenticationFeatureSessionsHttpModule } from '@finance/authentication/feature-sessions/feature-http';

export enum AuthenticationCoreFeatureShellPaths {
  DOCUMENTATION = 'docs',
  SIGNING = '',
}

export const AuthenticationCoreFeatureShellRoutes: Routes = [
  {
    path: AuthenticationCoreFeatureShellPaths.SIGNING,
    module: AuthenticationFeatureSessionsHttpModule,
  },
];
