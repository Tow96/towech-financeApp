/** desktop-toaster.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service in charge of handling the toast tray
 */
// Libraries
import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source } from '@state-adapt/rxjs';
import { DesktopToast, NewToast, ToastTypes } from '@finance/desktop/shared/utils-types';

import * as uuid from 'uuid';

@Injectable({ providedIn: 'root' })
export class DesktopToasterService {
  private storeName = 'toast-tray';
  private initialState: DesktopToast[] = [];

  // Pipes --------------------------------------------------------------------
  public addAccent$ = new Source<NewToast>('[Toast Service] Add Accent Toast');
  public addError$ = new Source<NewToast>('[Toast Service] Add Error Toast');
  public addSuccess$ = new Source<NewToast>('[Toast Service] Add Success Toast');
  public addWarning$ = new Source<NewToast>('[Toast Service] Add Warning Toast');
  public dismiss$ = new Source<string>('[Toast Service] Dismiss Toast');

  // Adapter ------------------------------------------------------------------
  private toastAdapter = createAdapter<DesktopToast[]>()({
    addAccent: (state, toast: NewToast) => this.addToast(state, toast, ToastTypes.ACCENT),
    addError: (state, toast: NewToast) => this.addToast(state, toast, ToastTypes.ERROR),
    addSuccess: (state, toast: NewToast) => this.addToast(state, toast, ToastTypes.SUCCESS),
    addWarning: (state, toast: NewToast) => this.addToast(state, toast, ToastTypes.WARNING),
    dismiss: (state, id: string) => [...state.filter(t => t.id !== id)],
  });

  // Store --------------------------------------------------------------------
  public toasts = adaptNgrx([this.storeName, this.initialState, this.toastAdapter], {
    addAccent: this.addAccent$,
    addError: this.addError$,
    addSuccess: this.addSuccess$,
    addWarning: this.addWarning$,
    dismiss: this.dismiss$,
  });

  // Helpers ------------------------------------------------------------------
  private addToast = (
    state: DesktopToast[],
    newToast: NewToast,
    type: ToastTypes
  ): DesktopToast[] => {
    const toast: DesktopToast = { id: uuid.v4(), type, ...newToast };

    // TODO: Use state.toSpliced(0, 0, newToast) when it finally arrives
    return [toast, ...state];
  };
}
