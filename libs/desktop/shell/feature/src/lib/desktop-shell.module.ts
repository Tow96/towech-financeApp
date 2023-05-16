// Libraries
import { NgModule } from '@angular/core';
// Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DesktopShellUtilsEnvironmentsModule } from '@towech-finance/desktop/shell/utils/environments';
// Services
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/feature/error-handler';
// Misc
import { desktopShellRoutes } from './desktop-shell.routes';

@NgModule({
  providers: [DesktopToasterService, DesktopGlobalErrorToast],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(desktopShellRoutes),
    DesktopShellUtilsEnvironmentsModule,
  ],
  exports: [RouterModule],
})
export class DesktopShellModule {}
