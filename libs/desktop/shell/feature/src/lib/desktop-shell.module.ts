import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { desktopShellRoutes } from './desktop-shell.routes';
import { LayoutComponent } from '@towech-finance/desktop/shell/ui/layout';
import { CommonModule } from '@angular/common';

@NgModule({
  providers: [DesktopToasterService],
  imports: [CommonModule, RouterModule.forRoot(desktopShellRoutes)],
  exports: [RouterModule],
})
export class DesktopShellModule {}
