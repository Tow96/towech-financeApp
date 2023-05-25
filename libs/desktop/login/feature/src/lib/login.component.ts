/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
// Modules
import { NgrxFormsModule } from 'ngrx-forms';
import { AsyncPipe, NgIf } from '@angular/common';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';

// NGRX
import { LoginStore } from './login.store';
import { SharedInputComponent } from '@towech-finance/shared/ui/input';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  providers: [LoginStore],
  imports: [AsyncPipe, NgIf, DesktopToasterComponent, NgrxFormsModule, SharedInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <div class="login-container" *ngIf="store.form$ | async as form">
      <h1>Login</h1>
      <form novalidate [ngrxFormState]="form" (submit)="onLoginFormSubmit()">
        <towech-finance-shared-input
          label="Username"
          [ngrxFormControlState]="form.controls.username"
          (ngrxFormsAction)="store.handleFormAction($event)">
        </towech-finance-shared-input>
        <towech-finance-shared-input
          label="Password"
          type="password"
          [ngrxFormControlState]="form.controls.password"
          (ngrxFormsAction)="store.handleFormAction($event)">
        </towech-finance-shared-input>
        <button type="submit">Login</button>
      </form>
    </div>
  `,
})
export class DesktopLoginComponent {
  public constructor(public readonly store: LoginStore) {}

  public onLoginFormSubmit() {
    this.store.login();
  }
}
