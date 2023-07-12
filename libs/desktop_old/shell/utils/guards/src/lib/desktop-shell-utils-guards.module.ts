import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';

@NgModule({
  providers: [AuthGuard, NoAuthGuard],
})
export class DesktopShellUtilsGuardsModule {}
