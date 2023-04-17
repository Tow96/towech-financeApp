import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError, timer } from 'rxjs';

export interface LoginCredentials {
  username?: string | null;
  password?: string | null;
}

@Injectable({ providedIn: 'root' })
export class DesktopAuthenticationService {
  // TODO: Connect using HTTP to services
  login(credentials: LoginCredentials) {
    return timer(2000).pipe(
      switchMap(() =>
        credentials.username !== 'fail'
          ? { message: 'success' }
          : throwError(() => new Error('Fail'))
      )
    );
  }
}
