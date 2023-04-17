import { Route } from '@angular/router';
import { LayoutComponent } from '@towech-finance/desktop/shell/ui/layout';

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
        path: 'login',
        loadComponent: async () =>
          (await import('@towech-finance/desktop/login/feature')).DesktopLoginComponent,
      },
    ],
  },
];
