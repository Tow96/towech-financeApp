/** user.api.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains all calls to the user endpoint
 */
// Libraries
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@finance/desktop/shared/utils-environments';
import { EditUser, UserModel } from '@finance/shared/utils-types';
import { Observable, exhaustMap } from 'rxjs';
// Pipes
import { patch } from './api.utils';
import { ApiAction, toApiResponse, toastSuccess } from './rxjs.utils';
// Models
import { Action } from '@ngrx/store';
// Services
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Actions
import { editActions } from './user.actions';

const ROOTURL = `${environment.apiUrl}/user`;

export function editCall(http = inject(HttpClient), toasts = inject(DesktopToasterService)) {
  return (source$: Observable<ApiAction<EditUser>>): Observable<Action> =>
    source$.pipe(
      exhaustMap(action =>
        patch<UserModel>(ROOTURL, action.payload, http).pipe(
          toastSuccess('Edited user', toasts),
          toApiResponse(editActions, 'Failed to update user', toasts)
        )
      )
    );
}
