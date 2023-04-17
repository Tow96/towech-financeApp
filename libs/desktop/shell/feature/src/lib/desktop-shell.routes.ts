import { Route } from '@angular/router';
import { DesktopDashboardComponent } from '@towech-finance/desktop/dashboard/feature';
import { DesktopLoginComponent } from '@towech-finance/desktop/login/feature';
import { LayoutComponent } from '@towech-finance/desktop/shell/ui/layout';

export const desktopShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DesktopDashboardComponent,
      },
      {
        path: 'login',
        component: DesktopLoginComponent,
      },
    ],
  },
];
