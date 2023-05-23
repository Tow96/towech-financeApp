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

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  providers: [LoginStore],
  imports: [AsyncPipe, NgIf, DesktopToasterComponent, NgrxFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <div class="login-container" *ngIf="store.form$ | async as form">
      <h1>Login</h1>
      <form novalidate [ngrxFormState]="form" (submit)="onLoginFormSubmit()">
        <input
          type="text"
          [ngrxFormControlState]="form.controls.username"
          (ngrxFormsAction)="store.handleFormAction($event)" />
        <input
          type="password"
          [ngrxFormControlState]="form.controls.password"
          (ngrxFormsAction)="store.handleFormAction($event)" />
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
