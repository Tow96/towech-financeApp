import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DesktopShellConfig } from '@towech-finance/desktop/shell/feature';

bootstrapApplication(AppComponent, DesktopShellConfig).catch(err => console.error(err));
