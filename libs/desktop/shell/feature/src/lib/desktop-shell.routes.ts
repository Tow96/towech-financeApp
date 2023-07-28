import { Route } from '@angular/router';
import { LayoutComponent } from '@towech-finance/desktop/shell/ui/layout';
import { DesktopUserAuthGuard, DesktopUserNoAuthGuard } from '@towech-finance/desktop/user/guards';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('@towech-finance/desktop/dashboard/feature')).DesktopDashboardComponent,
      },
      {
        path: 'settings',
        loadComponent: async () =>
          (await import('@towech-finance/desktop/settings/feature')).SettingsFeatureComponent,
      },
    ],
    canActivate: [DesktopUserAuthGuard],
  },
  {
    path: 'login',
    loadComponent: async () =>
      (await import('@towech-finance/desktop/login/feature')).DesktopLoginComponent,
    canActivate: [DesktopUserNoAuthGuard],
  },
];
