// Libraries
import { Routes } from '@nestjs/core';
// Modules
import { AuthenticationHttpSignageModule } from '@towech-finance/authentication/http/signage';

export enum AuthenticationShellPaths {
  DOCUMENTATION = 'docs',
  SIGNING = '',
}

export const AuthenticationShellRoutes: Routes = [
  {
    path: AuthenticationShellPaths.SIGNING,
    module: AuthenticationHttpSignageModule,
  },
];
