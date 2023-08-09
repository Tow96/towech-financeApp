/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  Input,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Source, toSource } from '@state-adapt/rxjs';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { debounceTime, tap } from 'rxjs';
// Services
import { DesktopUserService, Status } from '@finance/desktop/shared/data-access-user';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Components
import { DesktopButtonComponent } from '@finance/desktop/shared/ui-button';
import { DesktopCheckboxComponent } from '@finance/desktop/shared/ui-checkbox';
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';
import { DesktopSpinner } from '@finance/desktop/shared/ui-spinner';
// Models
import { LoginUser } from '@finance/shared/utils-types';

// TODO: Move this into its own library when more forms are created -----------
export type IForm<T> = {
  [K in keyof T]: AbstractControl<T[K] | null>;
};

@Directive({
  selector: '[patchFormGroupValues]', // eslint-disable-line @angular-eslint/directive-selector
  standalone: true,
})
export class PatchFormGroupValuesDirective<T> {
  @Input() public formGroup?: FormGroup<IForm<T>>;
  @Input()
  public set patchFormGroupValues(val: T | undefined) {
    if (!this.formGroup || !val) return;
    this.formGroup.patchValue(val, { emitEvent: false });
  }
}
// ----------------------------------------------------------------------------
@Component({
  standalone: true,
  selector: 'finance-login',
  styleUrls: ['./login.component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    PatchFormGroupValuesDirective,
    DesktopButtonComponent,
    DesktopCheckboxComponent,
    DesktopInputComponent,
    DesktopSpinner,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login">
      <finance-spinner
        *ngIf="isLoading(user.store.status$ | async)"
        class="login__spinner"
        size="5rem"></finance-spinner>
      <div class="login__container">
        <h1>Login</h1>
        <form
          [formGroup]="form"
          [patchFormGroupValues]="store.form$ | async"
          (submit)="login$.next()">
          <finance-input id="form-username" label="Username" formControlName="username">
          </finance-input>
          <finance-input
            id="form-password"
            type="password"
            label="Password"
            formControlName="password">
          </finance-input>
          <div class="bottom-row">
            <finance-checkbox label="Keep Session" formControlName="keepSession">
            </finance-checkbox>
            <finance-button type="submit" id="Login-button">Login</finance-button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class DesktopLoginComponent {
  private storeName = 'login';
  public initialState: LoginUser = {
    keepSession: false,
    password: '',
    username: '',
  };

  public form = new FormGroup<IForm<LoginUser | null>>({
    keepSession: new FormControl(this.initialState.keepSession),
    password: new FormControl(this.initialState.password, {
      validators: [Validators.required],
    }),
    username: new FormControl(this.initialState.username, {
      validators: [Validators.required],
    }),
  });

  // Sources ------------------------------------------------------------------
  public login$ = new Source<void>('[Login Page] Trigger Login');

  // Pipes --------------------------------------------------------------------
  private formChanges$ = this.form.valueChanges.pipe(
    debounceTime(150),
    toSource('[Login Page] Form change')
  );
  private loginFail$ = this.user.onLoginError$.pipe(tap(() => this.invalidateForm()));

  // Adapter ------------------------------------------------------------------
  private adapter = createAdapter<LoginUser>()({
    clear: () => this.initialState,
    changeForm: (state, form) => ({ ...state, ...form }),
    login: state => this.triggerLogin(state),
    selectors: {
      form: state => state,
    },
  });

  // Store --------------------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    clear: this.loginFail$,
    changeForm: this.formChanges$,
    login: this.login$,
  });

  // Helpers ------------------------------------------------------------------
  private triggerLogin(state: LoginUser): LoginUser {
    // Triggers the pipe generic pipe instead of having an specific login pipe in the userservice to avoid circular imports
    if (this.form.invalid)
      this.toasts.addError$.next({ message: 'Please provide username and password' });
    else this.user.login$.next(state);

    return state;
  }

  private invalidateForm() {
    const controls = this.form.controls!; // We created the form, we can trust that it exists

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
