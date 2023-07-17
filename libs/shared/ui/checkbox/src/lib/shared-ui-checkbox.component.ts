/** shared-ui-checkbox.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom Checkbox component
 */
// Libraries
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'towech-finance-checkbox',
  styleUrls: ['./shared-ui-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="checkbox">
      <input [id]="id" type="checkbox" [checked]="value" (input)="onChange($event)" />
      <label [for]="id">{{ label }}</label>
    </div>
  `,
})
export class SharedCheckboxComponent implements ControlValueAccessor {
  @Input() public label = '';
  @Input() public id = 'towech-checkbox';
  public value = false;
  public disabled = false;
  public customTouched = (): void => {};
  public customChanged = (value: boolean): void => {};

  public registerOnChange(fn: any): void {
    this.customChanged = fn;
  }

  public registerOnTouched(fn: any): void {
    this.customTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).checked;
    this.customChanged(value);
  }

  public writeValue(value: boolean): void {
    this.value = value;
  }
}
