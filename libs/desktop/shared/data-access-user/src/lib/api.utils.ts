/** api.utils.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Functions that communicate with microservices using http
 */
// Libraries
import { inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
// Services
import { HttpClient } from '@angular/common/http';

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
