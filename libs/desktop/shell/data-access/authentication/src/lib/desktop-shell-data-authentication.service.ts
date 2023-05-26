/** desktop-shell-data-authentication.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Angular service that communicates with the authentication microservice
 */
// Libraries
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import jwtDecode from 'jwt-decode';
// Models
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';
import { APP_CONFIG, environment } from '@towech-finance/desktop/shell/utils/environments';
@Injectable({ providedIn: 'root' })
export class DesktopAuthenticationService {
  private headers = { Accept: 'application/json' };
  protected ROOTURL = this.appConfig.authenticationServiceUrl;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private processError = (error: any) => {
    console.error(error);
    return throwError(() => error.error);
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  public constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly appConfig: typeof environment
  ) {}

  public login(credentials: LoginUser): Observable<{ user: UserModel; token: string }> {
    return this.http
      .post(`${this.ROOTURL}/login`, credentials, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        map((res: any) => ({ user: jwtDecode(res.token) as UserModel, token: res.token })), // eslint-disable-line @typescript-eslint/no-explicit-any
        catchError(error => this.processError(error))
      );
  }

  public refresh(): Observable<{ user: UserModel; token: string }> {
    return this.http
      .post(`${this.ROOTURL}/refresh`, undefined, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        map((res: any) => ({ user: jwtDecode(res.token) as UserModel, token: res.token })), // eslint-disable-line @typescript-eslint/no-explicit-any
        catchError(error => this.processError(error))
      );
  }

  public logout(): Observable<boolean> {
    return this.http
      .post(`${this.ROOTURL}/logout`, undefined, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(error => this.processError(error))
      );
  }
}
