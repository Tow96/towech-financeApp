/** shell.routes.ts
 * Copyright (c) 2023, Towechlabs
 *
 * File that handles all the http routes for the service
 */
// Libraries
import { Routes } from '@nestjs/core';
// Modules
import { AuthenticationSessionsHttpModule } from '@finance/authentication/feature-sessions/feature-http';

export enum AuthenticationShellPaths {
  DOCUMENTATION = 'docs',
  SIGNING = '',
}

export const AuthenticationShellRoutes: Routes = [
  {
    path: AuthenticationShellPaths.SIGNING,
    module: AuthenticationSessionsHttpModule,
  },
];
