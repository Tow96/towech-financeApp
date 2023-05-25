/** login.store.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component store for the login screen, this handles all the local state
 */
// Libraries
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
// NGRX
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';
import {
  Actions,
  FormGroupState,
  createFormGroupState,
  formGroupReducer,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';

interface FormValues {
  username: string;
  password: string;
  keepSession: boolean;
}

interface State {
  form: FormGroupState<FormValues>;
}

export const generateForm = (): FormGroupState<FormValues> => {
  return createFormGroupState('loginForm', {
    keepSession: false,
    password: '',
    username: '',
  });
};

const validateForm = updateGroup<FormValues>({
  username: validate(required),
  password: validate(required),
});

@Injectable()
export class LoginStore extends ComponentStore<State> {
  public constructor(
    private readonly globalStore: Store,
    private readonly toasts: DesktopToasterService
  ) {
    super({
      form: validateForm(generateForm()),
    });
  }

  // Selectors -----------------------------------------------------
  public form$ = this.select(state => state.form);

  // Effects -------------------------------------------------------
  public handleFormAction = this.effect((action$: Observable<Actions<string> | Actions<boolean>>) =>
    this.updateForm$(action$)
  );

  public login = this.effect((login$: Observable<void>) => this.handleLogin$(login$));

  // Pipes ---------------------------------------------------------
  private updateForm$(action$: Observable<Actions<string> | Actions<boolean>>): Observable<void> {
    return action$.pipe(
      concatLatestFrom(() => this.form$),
      map(([action, form]) => formGroupReducer(form, action)), // Generates the new form-state
      map(updatedForm => this.patchState({ form: validateForm(updatedForm) })) // Stores the state after validation
    );
  }

  private handleLogin$(login$: Observable<void>): Observable<void> {
    return login$.pipe(
      concatLatestFrom(() => this.form$),
      map(([, form]) => {
        if (form.isInvalid || form.isPristine) {
          this.toasts.addWarning('Please complete the fields');
          return;
        }
        this.globalStore.dispatch(UserActions.login({ credentials: form.value }));
      })
    );
  }
}
