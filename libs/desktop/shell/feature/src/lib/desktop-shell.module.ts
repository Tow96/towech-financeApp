import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DesktopToasterComponent,
  DesktopToasterService,
} from '@towech-finance/desktop/toaster/feature';

@NgModule({
  declarations: [],
  imports: [CommonModule, DesktopToasterComponent],
  providers: [DesktopToasterService],
  exports: [DesktopToasterComponent],
})
export class DesktopShellModule {}
