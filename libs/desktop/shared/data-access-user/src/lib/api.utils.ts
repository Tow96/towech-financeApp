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
  body?: unknown,
  http = inject(HttpClient)
): Observable<Response> {
  return http.post<Response>(url, body, { headers, withCredentials: true }).pipe(processError());
}

export function patch<Response>(
  url: string,
  body?: unknown,
  http = inject(HttpClient)
): Observable<Response> {
  return http.patch<Response>(url, body, { headers }).pipe(processError());
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
