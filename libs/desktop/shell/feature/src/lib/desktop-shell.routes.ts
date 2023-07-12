import { Route } from '@angular/router';
import { LayoutComponent } from '@towech-finance/desktop/shell/ui/layout';
// import { AuthGuard, NoAuthGuard } from '@towech-finance/desktop/shell/utils/guards';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    // children: [
    //   {
    //     path: '',
    //     loadComponent: async () =>
    //       (await import('@towech-finance/desktop/dashboard/feature')).DesktopDashboardComponent,
    //   },
    //   {
    //     path: 'settings',
    //     loadComponent: async () =>
    //       (await import('@towech-finance/desktop/settings/feature')).SettingsFeatureComponent,
    //   },
    // ],
    // canActivate: [AuthGuard],
  },
  // {
  //   path: 'login',
  //   loadComponent: async () =>
  //     (await import('@towech-finance/desktop/login/feature')).DesktopLoginComponent,
  //   canActivate: [NoAuthGuard],
  // },
];
