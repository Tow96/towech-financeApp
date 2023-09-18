/** ui-user-form.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 *  Form component that handles the form that edits the user
 */
// Libraries
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// Components
import { DesktopButtonComponent } from '@finance/desktop/shared/ui-button';
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';
// Models
import { EditUser } from '@finance/shared/utils-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesktopButtonComponent, DesktopInputComponent, ReactiveFormsModule],
  standalone: true,
  selector: 'finance-desktop-settings-ui-user-form',
  styles: [
    `
      h2 {
        margin-bottom: 0;
      }

      .form-input {
        display: flex;
        align-items: center;
        width: 25rem;
        > p {
          width: 5rem;
          padding-right: 1rem;
          font-size: 1.5rem;
        }
      }
      .form-submit {
        width: 25rem;
        margin-left: auto;
      }
    `,
  ],
  template: `
    <h2>Edit User</h2>
    <form [formGroup]="form" (submit)="submitted.next()">
      <div class="form-input">
        <p>Name:</p>
        <finance-input data-test-id="name" formControlName="name"></finance-input>
      </div>
      <div class="form-input">
        <p>E-Mail</p>
        <finance-input data-test-id="mail" formControlName="mail"></finance-input>
      </div>
      <div class="form-submit">
        <finance-button data-test-id="submit-edit-user" type="submit">Save</finance-button>
      </div>
    </form>
  `,
})
export class DesktopSettingsUiUserFormComponent {
  @Output() submitted = new EventEmitter<void>();

  private initialValues: EditUser = {
    mail: '',
    name: '',
  };

  form = this.fb.group({
    mail: [this.initialValues.mail],
    name: [this.initialValues.name],
  });

  resetForm = () => this.form.reset(this.initialValues);

  constructor(private readonly fb: FormBuilder) {}
}
