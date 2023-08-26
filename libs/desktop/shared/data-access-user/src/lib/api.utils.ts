/** api.utils.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Functions that communicate with microservices using http
 */
// Libraries
import { inject } from '@angular/core';
import { Action } from '@state-adapt/core';
import { splitSources } from '@state-adapt/rxjs';
import { Observable, catchError } from 'rxjs';
// Services
import { HttpClient } from '@angular/common/http';
// Types
import { Prefix, PrefixOutputs } from './rxjs.utils';

// Variables ------------------------------------------------------------------
const headers = { Accept: 'application/json' };

// Http calls -----------------------------------------------------------------
export function postWithCredentials<Response>(
  url: string,
  body?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  http = inject(HttpClient)
): Observable<Response> {
  return http.post<Response>(url, body, { headers, withCredentials: true }).pipe(processError());
}

// Helper functions -----------------------------------------------------------
function processError<R>() {
  return (source$: Observable<R>): Observable<R> =>
    source$.pipe(
      catchError(err => {
        const e = err.error || {};
        e['message'] = e['message'] || 'Unexpected error';
        throw e;
      })
    );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function customSplit<A extends Action<any, PrefixOutputs>>(
  prefix: Prefix,
  obs$: Observable<A>
): {
  success$: Observable<
    A extends Action<infer P, `${Prefix}.success$`> ? Action<P, `${Prefix}.success$`> : never
  >;
  cached$: Observable<Action<void, `${Prefix}.cached$`>>;
  error$: Observable<Action<string, `${Prefix}.error$`>>;
} {
  return splitSources(obs$, {
    success$: `${prefix}.success$`,
    error$: `${prefix}.error$`,
    cached$: `${prefix}.cached$`,
  }) as any;
}
/* eslint-enable */
