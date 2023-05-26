/** shared-ui-checkbox.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom Checkbox component
 */
// Libraries
import { Component, forwardRef, Input } from '@angular/core';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

@Component({
  standalone: true,
  selector: 'towech-finance-checkbox',
  styleUrls: ['./shared-ui-checkbox.component.scss'],
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
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
export class SharedCheckboxComponent implements FormViewAdapter {
  @Input() public label = '';
  @Input() public id = 'towech-checkbox';
  public value = false;
  public disabled = false;
  public touched = (): void => {}; // eslint-disable-line
  public changed = (value: boolean): void => {}; // eslint-disable-line

  public onChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).checked;
    this.changed(value);
  }

  public setViewValue(value: boolean): void {
    this.value = value;
  }
  public setOnChangeCallback(fn: (value: boolean) => void): void {
    this.changed = fn;
  }
  public setOnTouchedCallback(fn: () => void): void {
    this.touched = fn;
  }
  public setIsDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
