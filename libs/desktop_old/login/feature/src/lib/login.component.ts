/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
// Modules
import { AsyncPipe, NgIf } from '@angular/common';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';
import { LoginFormComponent } from '@towech-finance/desktop/login/ui/form';
// NGRX
import { LoginStore } from './login.store';

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  providers: [LoginStore],
  imports: [AsyncPipe, NgIf, DesktopToasterComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <div class="login-container" *ngIf="store.form$ | async as form">
      <h1>Login</h1>
      <towech-finance-login-form
        [form]="form"
        (submitted)="onLoginFormSubmit()"
        (updated)="store.handleFormAction($event)">
      </towech-finance-login-form>
    </div>
  `,
})
export class DesktopLoginComponent {
  public constructor(public readonly store: LoginStore) {}

  public onLoginFormSubmit() {
    this.store.login();
  }
}
