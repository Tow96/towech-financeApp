/** authentication.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Angular service that communicates with the authentication microservice
 */
// Libraries
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { toRequestSource } from '@state-adapt/rxjs';
import { catchError, Observable, map, throwError, tap } from 'rxjs';
import jwtDecode from 'jwt-decode';
// Services
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
import { Router } from '@angular/router';
import { APP_CONFIG, environment } from '@finance/desktop/shared/utils-environments';
import { LoginUser, UserModel } from '@finance/shared/utils-types';

export type UserResponse = {
  user: UserModel;
  token: string;
};

@Injectable()
export class DesktopAuthenticationService {
  private ROOTURL = this.env.authenticationServiceUrl;

  private tokenIntoResponse = (token: string): UserResponse => ({
    user: jwtDecode<UserModel>(token),
    token,
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private processError(err: Record<string, any>) {
    const e = err['error'];
    e['message'] = e['message'] || 'Unexpected error';
    return throwError(() => e);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  protected postWithCredentials<Payload, Response>(
    url: string,
    body?: Payload
  ): Observable<Response> {
    return this.http
      .post<Response>(`${this.ROOTURL}/${url}`, body, {
        headers: { Accept: 'application/json' },
        withCredentials: true,
      })
      .pipe(catchError(e => this.processError(e)));
  }

  protected callLogin<T extends string>(credentials: LoginUser, typePrefix: T) {
    return this.postWithCredentials<LoginUser, { token: string }>('login', credentials).pipe(
      tap(() => console.log('http')),
      map(res => this.tokenIntoResponse(res.token)),
      toRequestSource(typePrefix)
    );
  }

  protected callLogout<T extends string>(typePrefix: T) {
    return this.postWithCredentials('logout').pipe(
      map(() => true),
      toRequestSource(typePrefix)
    );
  }

  protected callRefresh<T extends string>(typePrefix: T) {
    return this.postWithCredentials<null, { token: string }>('refresh').pipe(
      map(res => this.tokenIntoResponse(res.token)),
      toRequestSource(typePrefix)
    );
  }

  constructor(
    protected readonly http: HttpClient,
    protected readonly router: Router,
    protected readonly toast: DesktopToasterService,
    @Inject(APP_CONFIG) protected readonly env: typeof environment
  ) {}
}
