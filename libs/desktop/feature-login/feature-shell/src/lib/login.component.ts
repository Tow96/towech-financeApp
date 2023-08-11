/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormGroup, Validators } from '@angular/forms';
import { Source } from '@state-adapt/rxjs';
import { tap } from 'rxjs';
// Services
import { DesktopUserService, Status } from '@finance/desktop/shared/data-access-user';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
import { IForm, StateAdaptFormService } from '@finance/desktop/shared/data-access-form';
// Components
import { DesktopSpinnerComponent } from '@finance/desktop/shared/ui-spinner';
import { DesktopLoginShellUiFormComponent } from '@finance/desktop/feature-login/ui-form';
// Models
import { LoginUser } from '@finance/shared/utils-types';

@Component({
  standalone: true,
  selector: 'finance-login',
  styleUrls: ['./login.component.scss'],
  imports: [AsyncPipe, DesktopLoginShellUiFormComponent, DesktopSpinnerComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login">
      <finance-spinner *ngIf="isLoading(user.store.status$ | async)" size="5rem"></finance-spinner>
      <div class="login__container">
        <h1>Login</h1>
        <finance-login-form [formState]="formState" (submitted)="login$.next(formState.form)">
        </finance-login-form>
      </div>
    </div>
  `,
})
export class DesktopLoginComponent {
  // State ------------------------------------------------------------------
  public login$ = new Source<FormGroup<IForm<LoginUser>>>('[Login Page] Trigger Login');
  private onLogin$ = this.login$.pipe(
    tap(({ payload }) => {
      // Triggers the pipe generic pipe instead of having an specific login pipe in the userservice to avoid circular imports
      if (payload.invalid)
        this.toasts.addError$.next({ message: 'Please provide username and password' });
      else this.user.login$.next({ ...payload.value } as LoginUser);
    })
  );
  private loginFail$ = this.user.onLoginError$.pipe(tap(() => this.invalidateForm()));
  public initialState: LoginUser = { keepSession: false, password: '', username: '' };
  public formState = new StateAdaptFormService<LoginUser>(
    'login-form',
    this.loginFail$,
    this.onLogin$,
    this.initialState,
    { password: [Validators.required], username: [Validators.required] }
  );

  // Helpers ------------------------------------------------------------------
  private invalidateForm() {
    // We created the form, we can trust that it exists
    const controls = this.formState.form.controls!; // eslint-disable-line
    const formKeys = Object.keys(controls);
    formKeys.forEach(key => controls[key as keyof LoginUser].markAsDirty());
    this.changeRef.markForCheck(); // Manual change since we're using onPush
  }
  public isLoading(status: Status | null): boolean {
    if (status === null) return false;
    return status === Status.IN_PROGRESS;
  }

  public constructor(
    public readonly toasts: DesktopToasterService,
    public readonly user: DesktopUserService,
    private readonly changeRef: ChangeDetectorRef
  ) {}
}
