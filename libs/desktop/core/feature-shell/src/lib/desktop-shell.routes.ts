import { Route } from '@angular/router';
import { DesktopLayoutComponent } from '@finance/desktop/core/ui-layout';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: DesktopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('@finance/desktop/feature-dashboard/shell')).DesktopDashboardComponent,
      },
      {
        path: 'settings',
        loadComponent: async () =>
          (await import('@finance/desktop/feature-settings/shell')).DesktopSettingsComponent,
      },
    ],
    canActivate: [DesktopUserAuthGuard],
  },
  {
    path: 'login',
    loadComponent: async () =>
      (await import('@finance/desktop/feature-login/feature-shell')).DesktopLoginComponent,
    canActivate: [DesktopUserNoAuthGuard],
  },
];
