import { Injectable } from '@angular/core';
import { switchMap, throwError, timer } from 'rxjs';

export interface LoginCredentials {
  username?: string | null;
  password?: string | null;
}

@Injectable({ providedIn: 'root' })
export class DesktopAuthenticationService {
  // TODO: Connect using HTTP to services
  /* eslint-disable */
  login(credentials: LoginCredentials) {
    return timer(2000).pipe(
      switchMap(() =>
        credentials.username !== 'fail' ? 'success' : throwError(() => new Error('Fail'))
      )
    );
  }
}
