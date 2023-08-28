/** refresh.interceptor.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Interceptor that adds the auth token for the api
 */
// Libraries
import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { filter, first, mergeMap, take } from 'rxjs';
// Services
// import { DesktopUserService } from './user.service';
// import { environment } from '@finance/desktop/shared/utils-environments';

// const getAuthReq = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
//   const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
//   return authReq;
// };
// const needsToken = (req: HttpRequest<unknown>): boolean => {
//   const matchesPattern = new RegExp(`^${environment.apiUrl}`).test(req.url);
//   const isRefreshEndpoint = new RegExp(`^${environment.apiUrl}/refresh`).test(req.url);
//   const isLoginEndpoint = new RegExp(`^${environment.apiUrl}/refresh`).test(req.url);
//   return matchesPattern && !isRefreshEndpoint && isLoginEndpoint;
// };

/* eslint-disable max-nested-callbacks */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  // const user = inject(DesktopUserService);
  // user.refresh$.next();
  return next(req);
  // return user.store.token$.pipe(
  //   // filter(token => !needsToken(req) || !token.expired),
  //   first(),
  //   mergeMap(token => {
  //     console.log(token);
  //     if (!needsToken(req)) return next(req);
  //     return next(getAuthReq(req, token.value));
  //   })
  // );
};
