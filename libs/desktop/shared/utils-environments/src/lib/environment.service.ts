import { InjectionToken, Provider } from '@angular/core';
import { environment } from './environment';

export const APP_CONFIG = new InjectionToken('Application config');

export const provideDesktopEnvironment = (): Provider => {
  return { provide: APP_CONFIG, useValue: environment };
};
