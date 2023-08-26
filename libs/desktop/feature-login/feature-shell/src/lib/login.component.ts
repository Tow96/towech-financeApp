/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Validators } from '@angular/forms';
import { Source } from '@state-adapt/rxjs';
import { tap } from 'rxjs';
// Services
import { DesktopUserService, Status } from '@finance/desktop/shared/data-access-user';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
import { StateAdaptFormService } from '@finance/desktop/shared/data-access-form';
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
        <finance-login-form [formState]="formState" (submitted)="login$.next()">
        </finance-login-form>
      </div>
    </div>
  `,
})
export class DesktopLoginComponent {
  // Pipes/Sources ------------------------------------------------------------
  login$ = new Source<void>('[Login Page] Trigger Login');
  private onLogin$ = this.login$.pipe(
    tap(() => {
      // Triggers the pipe generic pipe instead of having an specific login pipe in the userservice to avoid circular imports
      if (this.formState.form.invalid)
        this.toasts.addError$.next({ message: 'Please provide username and password' });
      else this.user.login$.next(this.formState.form.value as LoginUser);
    })
  );
  private loginFail$ = this.user.onLogout.error$.pipe(
    tap(() => {
      this.formState.invalidateForm();
      this.changeRef.markForCheck(); // Manual change since we're using onPush
    })
  );
  // State --------------------------------------------------------------------
  initialState: LoginUser = { keepSession: false, password: '', username: '' };
  formState = new StateAdaptFormService(
    'login-form',
    this.loginFail$,
    this.onLogin$,
    this.initialState,
    { password: [Validators.required], username: [Validators.required] }
  );
  // HTML Helpers -------------------------------------------------------------
  isLoading(status: Status | null): boolean {
    if (status === null) return false;
    return status === Status.IN_PROGRESS;
  }

  constructor(
    readonly toasts: DesktopToasterService,
    readonly user: DesktopUserService,
    private readonly changeRef: ChangeDetectorRef
  ) {}
}
