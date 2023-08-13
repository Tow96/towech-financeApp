/** ui-form.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * UI for the login form
 */
// Libraries
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// Services
import {
  StateAdaptFormService,
  PatchFormGroupValuesDirective,
} from '@finance/desktop/shared/data-access-form';
// Components
import { DesktopButtonComponent } from '@finance/desktop/shared/ui-button';
import { DesktopCheckboxComponent } from '@finance/desktop/shared/ui-checkbox';
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';
// Types
import { LoginUser } from '@finance/shared/utils-types';

@Component({
  standalone: true,
  selector: 'finance-login-form',
  imports: [
    AsyncPipe,
    DesktopButtonComponent,
    DesktopCheckboxComponent,
    DesktopInputComponent,
    ReactiveFormsModule,
    NgIf,
    PatchFormGroupValuesDirective,
  ],
  styles: [
    `
      .login__bottom-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5px;
      }
    `,
  ],
  template: `
    <form
      *ngIf="formState"
      [formGroup]="formState.form"
      [patchFormGroupValues]="formState.store.form$ | async"
      (submit)="submitted.next()">
      <finance-input id="form-username" label="Username" formControlName="username">
      </finance-input>
      <finance-input id="form-password" type="password" label="Password" formControlName="password">
      </finance-input>
      <div class="login__bottom-row">
        <finance-checkbox id="form-keep" label="Keep Session" formControlName="keepSession">
        </finance-checkbox>
        <finance-button type="submit" id="Login-button">Login</finance-button>
      </div>
    </form>
  `,
})
export class DesktopLoginShellUiFormComponent {
  @Input() formState: StateAdaptFormService<LoginUser> | null = null;
  @Output() submitted = new EventEmitter<void>();
}
