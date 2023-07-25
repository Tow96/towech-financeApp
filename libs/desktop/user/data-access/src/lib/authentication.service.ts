/** authentication.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Angular service that communicates with the authentication microservice
 */
// Libraries
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, map, throwError, of } from 'rxjs';
import jwtDecode from 'jwt-decode';
// Services
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { Router } from '@angular/router';
import { APP_CONFIG, environment } from '@towech-finance/desktop/environment';
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';

export type UserResponse = {
  user: UserModel;
  token: string;
};

@Injectable()
export class DesktopAuthenticationService {
  private headers = { Accept: 'application/json' };
  private ROOTURL = this.env.authenticationServiceUrl;

  private tokenIntoResponse = (token: string): UserResponse => ({
    user: jwtDecode<UserModel>(token),
    token,
  });

  private postWithCredentials<Payload, Response>(
    url: string,
    body?: Payload
  ): Observable<Response> {
    return this.http
      .post<Response>(`${this.ROOTURL}/${url}`, body, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      })
      .pipe(catchError(error => throwError(() => error.error)));
  }

  protected login(credentials: LoginUser): Observable<UserResponse> {
    return this.postWithCredentials<LoginUser, { token: string }>('login', credentials).pipe(
      map(res => this.tokenIntoResponse(res.token))
    );
  }

  protected refresh(): Observable<UserResponse> {
    return this.postWithCredentials<null, { token: string }>('refresh').pipe(
      map(res => this.tokenIntoResponse(res.token))
    );
  }

  protected logout(): Observable<boolean> {
    return this.postWithCredentials('logout').pipe(map(() => true));
  }

  constructor(
    protected readonly http: HttpClient,
    protected readonly router: Router,
    protected readonly toast: DesktopToasterService,
    @Inject(APP_CONFIG) protected readonly env: typeof environment
  ) {}
}
