/** auth.api.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains the functions to communicate with the authentication microservice
 */
// Libraries
import { environment } from '@finance/desktop/shared/utils-environments';
import { LoginUser, UserModel } from '@finance/shared/utils-types';
import { postWithCredentials } from './api.utils';
import { HttpClient } from '@angular/common/http';
import { Observable, exhaustMap, map } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { catchErrorSource, toRequestSource } from '@state-adapt/rxjs';
import { Action } from '@state-adapt/core';
import { Router } from '@angular/router';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
import { inject } from '@angular/core';
import {
  Prefix,
  PrefixOutputs,
  catchAndToastSource,
  catchToastAndRedirectSource,
  navigateTo,
  toSuccessSource,
} from './rxjs.utils';

type TokenResponse = {
  token: string;
};
type UserResponse = {
  user: UserModel;
  token: string;
};

// Variables ------------------------------------------------------------------
const ROOTURL = environment.authenticationServiceUrl;

export function loginCall(
  typePrefix: Prefix,
  http = inject(HttpClient),
  toast = inject(DesktopToasterService),
  router = inject(Router)
) {
  return (
    source$: Observable<Action<LoginUser>>
  ): Observable<Action<UserResponse, PrefixOutputs>> =>
    source$.pipe(
      exhaustMap(action =>
        postWithCredentials<TokenResponse>(`${ROOTURL}/login`, action.payload, http).pipe(
          navigateTo('', router),
          toUserResponse(),
          toSuccessSource(typePrefix),
          catchAndToastSource(typePrefix, 'Unable to Log In', toast)
        )
      )
    );
}

export function logoutCall(typePrefix: Prefix, http = inject(HttpClient), router = inject(Router)) {
  return (source$: Observable<unknown>): Observable<Action<unknown, PrefixOutputs>> =>
    source$.pipe(
      exhaustMap(() =>
        postWithCredentials(`${ROOTURL}/logout`, null, http).pipe(toRequestSource(typePrefix))
      ),
      navigateTo('login', router)
    );
}

export function refreshCall(
  typePrefix: Prefix,
  http = inject(HttpClient),
  toasts = inject(DesktopToasterService),
  router = inject(Router)
) {
  return (source$: Observable<unknown>): Observable<Action<UserResponse, PrefixOutputs>> =>
    source$.pipe(
      exhaustMap(() =>
        postRefresh$(http).pipe(
          toSuccessSource(typePrefix),
          catchToastAndRedirectSource(typePrefix, 'login', 'Session expired', router, toasts)
        )
      )
    );
}

export const postRefresh$ = (http = inject(HttpClient)): Observable<UserResponse> =>
  postWithCredentials<TokenResponse>(`${ROOTURL}/refresh`, null, http).pipe(toUserResponse());

// Helpers ---------------------------------------------------------------------
function toUserResponse() {
  return (source$: Observable<TokenResponse>): Observable<UserResponse> =>
    source$.pipe(map(res => ({ user: jwtDecode<UserModel>(res.token), token: res.token })));
}
