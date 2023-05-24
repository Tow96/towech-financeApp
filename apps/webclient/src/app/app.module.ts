import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DesktopShellModule } from '@towech-finance/desktop/shell/feature';

@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, DesktopShellModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
