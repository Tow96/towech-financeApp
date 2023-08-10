import { Route } from '@angular/router';
import { DesktopLayoutComponent } from '@finance/desktop/core/layout';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: DesktopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('@finance/desktop/dashboard/shell')).DesktopDashboardComponent,
      },
      {
        path: 'settings',
        loadComponent: async () =>
          (await import('@finance/desktop/settings/shell')).DesktopSettingsComponent,
      },
    ],
    canActivate: [DesktopUserAuthGuard],
  },
  {
    path: 'login',
    loadComponent: async () => (await import('@finance/desktop/login/shell')).DesktopLoginComponent,
    canActivate: [DesktopUserNoAuthGuard],
  },
];
