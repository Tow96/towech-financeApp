/** shared-ui-input.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom UI for inputs, includes connection to ngrx-forms
 */
// Libraries
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// TODO: Make value change testing
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'finance-input',
  styleUrls: ['input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesktopInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input_component">
      <input
        placeholder=" "
        [type]="type"
        [value]="value"
        [disabled]="disabled"
        (input)="onChange($event)"
        (blur)="customTouched()" />
      <label>{{ label }}</label>
    </div>
  `,
})
export class DesktopInputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'password' = 'text';
  @Input() label = '';
  value = '';
  disabled = false;
  customTouched = (): void => {}; // eslint-disable-line
  customChanged = (_: string): void => {}; // eslint-disable-line

  registerOnChange(fn: (v: string) => void): void {
    this.customChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.customTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).value;
    this.customChanged(value);
  }

  writeValue(value: string): void {
    this.value = value;
  }
}
