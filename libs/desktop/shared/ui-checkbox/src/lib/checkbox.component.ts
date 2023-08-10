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
      useExisting: forwardRef(() => DesktopCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="checkbox">
      <input type="checkbox" [id]="label" [checked]="value" (input)="onChange($event)" />
      <label [for]="label">{{ label }}</label>
    </div>
  `,
})
export class DesktopCheckboxComponent implements ControlValueAccessor {
  @Input() public label = '';
  public value = false;
  public disabled = false;
  public customTouched = (): void => {}; // eslint-disable-line
  public customChanged = (_: boolean): void => {}; // eslint-disable-line

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
    this.value = (<HTMLInputElement>event.target).checked;
    this.customChanged((<HTMLInputElement>event.target).checked);
  }

  public writeValue(value: boolean): void {
    this.value = value;
  }
}
