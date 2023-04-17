import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DesktopShellModule } from '@towech-finance/desktop/shell/feature';

@NgModule({
  imports: [BrowserModule, DesktopShellModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
