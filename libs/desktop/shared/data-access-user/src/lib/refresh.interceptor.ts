/** refresh.interceptor.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Interceptor that adds the auth token for the api
 */
// Libraries
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { filter, first, mergeMap } from 'rxjs';
// Services
import { environment } from '@finance/desktop/shared/utils-environments';
import { DesktopUserService } from './user.service';

const getAuthReq = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return authReq;
};
const needsToken = (req: HttpRequest<unknown>): boolean => {
  const matchesPattern = new RegExp(`^${environment.apiUrl}`).test(req.url);
  const isRefreshEndpoint = new RegExp(`^${environment.apiUrl}/refresh`).test(req.url);
  const isLoginEndpoint = new RegExp(`^${environment.apiUrl}/login`).test(req.url);
  const isLogoutEndpoint = new RegExp(`^${environment.apiUrl}/logout`).test(req.url);

  return matchesPattern && !isRefreshEndpoint && !isLoginEndpoint && !isLogoutEndpoint;
};

/* eslint-disable max-nested-callbacks */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(DesktopUserService);
  if (!needsToken(req)) return next(req);

  user.refresh(); // TODO: fire only if expired
  return user.token$.pipe(
    filter(token => !token.expired),
    first(),
    mergeMap(token => {
      console.log(token);
      return next(getAuthReq(req, token.value));
    })
  );
};
