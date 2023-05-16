import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { desktopShellRoutes } from './desktop-shell.routes';
import { CommonModule } from '@angular/common';
import { DesktopGlobalErrorToast } from '@towech-finance/desktop/toasts/feature/error-handler';

@NgModule({
  providers: [DesktopToasterService, DesktopGlobalErrorToast],
  imports: [CommonModule, RouterModule.forRoot(desktopShellRoutes)],
  exports: [RouterModule],
})
export class DesktopShellModule {}
