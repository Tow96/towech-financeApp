// Libraries
import { NgModule } from '@angular/core';
// Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DesktopShellUtilsEnvironmentsModule } from '@towech-finance/desktop/shell/utils/environments';
import { DesktopShellDataAccessUserStateModule } from '@towech-finance/desktop/shell/data-access/user-state';
// Services
import { provideStore } from '@ngrx/store';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/feature/error-handler';
// Misc
import { desktopShellRoutes } from './desktop-shell.routes';
import { devOnlyModulesImport } from './imports/dev-only.modules';

@NgModule({
  providers: [DesktopToasterService, DesktopGlobalErrorToast, provideStore(), devOnlyModulesImport],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(desktopShellRoutes),
    DesktopShellUtilsEnvironmentsModule,
    DesktopShellDataAccessUserStateModule,
  ],
  exports: [RouterModule],
})
export class DesktopShellModule {}
