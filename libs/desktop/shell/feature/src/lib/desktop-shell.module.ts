// Libraries
import { NgModule } from '@angular/core';
// Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DesktopShellUtilsEnvironmentsModule } from '@towech-finance/desktop/shell/utils/environments';
import { DesktopShellDataAccessUserStateModule } from '@towech-finance/desktop/shell/data-access/user-state';
import { DesktopShellUtilsGuardsModule } from '@towech-finance/desktop/shell/utils/guards';
// Services
import { provideStore } from '@ngrx/store';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/feature/error-handler';
import { devOnlyModulesImport } from './imports/dev-only.modules';
// Misc
import { desktopShellRoutes } from './desktop-shell.routes';

@NgModule({
  providers: [DesktopToasterService, DesktopGlobalErrorToast, provideStore(), devOnlyModulesImport],
  imports: [
    // Base
    CommonModule,
    // Http
    HttpClientModule,
    // Routing
    RouterModule.forRoot(desktopShellRoutes),
    // NGRX
    DesktopShellUtilsEnvironmentsModule,
    DesktopShellDataAccessUserStateModule,
    // Guards
    DesktopShellUtilsGuardsModule,
  ],
  exports: [RouterModule],
})
export class DesktopShellModule {}
