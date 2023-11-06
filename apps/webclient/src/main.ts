import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DesktopShellConfig } from '@finance/desktop/core/shell';

bootstrapApplication(AppComponent, DesktopShellConfig).catch(err => console.error(err));
