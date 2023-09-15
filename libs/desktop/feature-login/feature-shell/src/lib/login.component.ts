/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
// Services
import { DesktopUserService, Status } from '@finance/desktop/shared/data-access-user';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Components
import { DesktopSpinnerComponent } from '@finance/desktop/shared/ui-spinner';
import { DesktopLoginShellUiFormComponent } from '@finance/desktop/feature-login/ui-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-login',
  styleUrls: ['./login.component.scss'],
  imports: [AsyncPipe, DesktopLoginShellUiFormComponent, DesktopSpinnerComponent, NgIf],
  providers: [DesktopUserService, DesktopToasterService],
  template: `
    <div class="login">
      <finance-spinner *ngIf="isLoading(user.status$ | async)" size="5rem"></finance-spinner>
      <div class="login__container">
        <h1>Login</h1>
        <finance-login-form data-test-id="login-form" (submitted)="validateAndSubmit()">
        </finance-login-form>
      </div>
    </div>
  `,
})
export class DesktopLoginComponent {
  @ViewChild(DesktopLoginShellUiFormComponent) formComponent!: DesktopLoginShellUiFormComponent;

  isLoading(status: Status | null): boolean {
    if (status === null) return false;
    return status === Status.IN_PROGRESS;
  }

  validateAndSubmit() {
    console.log(this.formComponent);
    if (this.formComponent.form.invalid) return this.toasts.addError('Complete the fields');

    this.user.login(this.formComponent.form.value);
  }

  constructor(readonly toasts: DesktopToasterService, readonly user: DesktopUserService) {}
}
