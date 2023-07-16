/** shared-ui-input.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom UI for inputs, includes connection to ngrx-forms
 */
// Libraries
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

@Component({
  standalone: true,
  selector: 'towech-finance-shared-input',
  styleUrls: ['./shared-ui-input.component.scss'],
  providers: [
    // {
    //   provide: NGRX_FORM_VIEW_ADAPTER,
    //   useExisting: forwardRef(() => SharedInputComponent),
    //   multi: true,
    // },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedInputComponent),
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
        (blur)="touched()" />
      <label>{{ label }}</label>
    </div>
  `,
})
export class SharedInputComponent implements ControlValueAccessor {
  @Input() public type: 'text' | 'password' = 'text';
  @Input() public label = '';
  public value = '';
  public disabled = false;
  public touched = (): void => {};
  public changed = (value: string): void => {};

  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).value;
    this.changed(value);
  }
}
