/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';
import { SharedFormElementInputComponent } from '@towech-finance/shared/ui/form-elements/input';
import { NgrxFormsModule } from 'ngrx-forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoginStore } from './login.store';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  providers: [LoginStore],
  imports: [
    AsyncPipe,
    NgIf,
    DesktopToasterComponent,
    SharedFormElementInputComponent,
    NgrxFormsModule,
  ],
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
  constructor(public readonly store: LoginStore) {}

  onLoginFormSubmit() {
    this.store.login();
  }
}
