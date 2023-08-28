/** desktop-toaster.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service in charge of handling the toast tray
 */
// Libraries
import { Injectable } from '@angular/core';
import { Store, createFeature } from '@ngrx/store';
// NGRX
import { toastActions } from './toast.actions';
import { reducer } from './toast.reducer';

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  private state = createFeature({
    name: 'toasts',
    reducer,
  });

  // Sources ------------------------------------------------------------------
  addAccent = (message: string) =>
    this.ngrx.dispatch(toastActions.addAccent({ payload: { message } }));
  addError = (message: string) =>
    this.ngrx.dispatch(toastActions.addError({ payload: { message } }));
  addSuccess = (message: string) =>
    this.ngrx.dispatch(toastActions.addSuccess({ payload: { message } }));
  addWarning = (message: string) =>
    this.ngrx.dispatch(toastActions.addWarning({ payload: { message } }));
  dismiss = (id: string) => this.ngrx.dispatch(toastActions.dismiss({ payload: id }));

  // Selectors ----------------------------------------------------------------
  tray$ = this.ngrx.select(this.state.selectToastsState);

  constructor(private readonly ngrx: Store) {
    ngrx.addReducer(this.state.name, this.state.reducer);
  }
}
