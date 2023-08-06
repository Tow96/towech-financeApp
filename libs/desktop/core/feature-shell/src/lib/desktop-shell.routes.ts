import { Route } from '@angular/router';
import { LayoutComponent } from '@finance/desktop/core/ui-layout';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@finance/desktop/core/utils-guards';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('@finance/desktop/feature-dashboard/shell'))
            .DesktopFeatureDashboardShellComponent,
      },
      {
        path: 'settings',
        loadComponent: async () =>
          (await import('@finance/desktop/feature-settings/shell'))
            .DesktopFeatureSettingsShellComponent,
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
