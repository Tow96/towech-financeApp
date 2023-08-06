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
  selector: 'finance-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesktopSharedUICheckboxComponent),
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
export class DesktopSharedUICheckboxComponent implements ControlValueAccessor {
  @Input() public label = '';
  @Input() public id = 'towech-checkbox';
  public value = false;
  public disabled = false;
  public customTouched = (): void => {};
  public customChanged = (_: boolean): void => {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  public registerOnChange(fn: (v: boolean) => void): void {
    this.customChanged = fn;
  }

  public registerOnTouched(fn: () => void): void {
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
