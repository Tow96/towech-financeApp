/** ui-form.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * UI for the login form
 */
// Libraries
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Components
import { DesktopButtonComponent } from '@finance/desktop/shared/ui-button';
import { DesktopCheckboxComponent } from '@finance/desktop/shared/ui-checkbox';
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';
// Types

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-login-form',
  imports: [
    DesktopButtonComponent,
    DesktopCheckboxComponent,
    DesktopInputComponent,
    ReactiveFormsModule,
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
    <form [formGroup]="form" (submit)="submitted.next()">
      <finance-input data-test-id="username" label="Username" formControlName="username">
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
  @Output() submitted = new EventEmitter<void>();

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    keepSession: [false],
  });

  constructor(private readonly fb: FormBuilder) {}
}
