/** auth.api.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains the functions to communicate with the authentication microservice
 */
// Libraries
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@finance/desktop/shared/utils-environments';
import { LoginUser } from '@finance/shared/utils-types';
import jwtDecode from 'jwt-decode';
import { Observable, exhaustMap, map } from 'rxjs';
// Pipes
import { postWithCredentials } from './api.utils';
import { catchAndRedirectAction, navigateTo, toAction, toApiResponse } from './rxjs.utils';
// Models
import { Action } from '@ngrx/store';
// Services
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
import { DecodedUser } from './types';
// Actions
import { loginActions, logoutActions, refreshActions } from './user.actions';

type TokenResponse = {
  token: string;
};
type UserResponse = {
  user: DecodedUser;
  token: string;
};

// Variables ------------------------------------------------------------------
const ROOTURL = environment.apiUrl;

export function loginCall(
  http = inject(HttpClient),
  router = inject(Router),
  toasts = inject(DesktopToasterService)
) {
  return (source$: Observable<{ type: string; payload: LoginUser }>): Observable<Action> =>
    source$.pipe(
      exhaustMap(action =>
        postWithCredentials<TokenResponse>(`${ROOTURL}/login`, action.payload, http).pipe(
          navigateTo('', router),
          toUserResponse(),
          toApiResponse(loginActions, 'Unable to Log In', toasts)
        )
      )
    );
}

export function logoutCall(http = inject(HttpClient), router = inject(Router)) {
  return (source$: Observable<unknown>): Observable<Action> =>
    source$.pipe(
      exhaustMap(() =>
        postWithCredentials(`${ROOTURL}/logout`, null, http).pipe(
          toApiResponse(logoutActions, 'Could not logout')
        )
      ),
      navigateTo('login', router)
    );
}

export function refreshCall(http = inject(HttpClient), router = inject(Router)) {
  return (source$: Observable<unknown>) =>
    source$.pipe(
      exhaustMap(() =>
        postWithCredentials<TokenResponse>(`${ROOTURL}/refresh`, null, http).pipe(
          toUserResponse(),
          toAction(refreshActions.success),
          catchAndRedirectAction(refreshActions.failure, 'login', 'Session expired', router)
        )
      )
    );
}

// Helpers ---------------------------------------------------------------------
function toUserResponse() {
  return (source$: Observable<TokenResponse>): Observable<UserResponse> =>
    source$.pipe(map(res => ({ user: jwtDecode<DecodedUser>(res.token), token: res.token })));
}
