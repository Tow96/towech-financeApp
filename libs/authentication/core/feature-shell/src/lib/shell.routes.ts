/** shell.routes.ts
 * Copyright (c) 2023, Towechlabs
 *
 * File that handles all the http routes for the service
 */
// Libraries
import { Routes } from '@nestjs/core';
// Modules
import { AuthenticationSessionsHttpModule } from '@finance/authentication/sessions/http';
import { AuthenticationUserHttpModule } from '@finance/authentication/user/http';

export enum AuthenticationShellPaths {
  DOCUMENTATION = 'docs',
  SIGNING = '',
  USER = 'user',
}

export const AuthenticationShellRoutes: Routes = [
  { path: AuthenticationShellPaths.SIGNING, module: AuthenticationSessionsHttpModule },
  { path: AuthenticationShellPaths.USER, module: AuthenticationUserHttpModule },
];
