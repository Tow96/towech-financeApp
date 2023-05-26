/** shared-ui-input.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Custom UI for inputs, includes connection to ngrx-forms
 */
// Libraries
import { Component, forwardRef, Input } from '@angular/core';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

@Component({
  standalone: true,
  selector: 'towech-finance-shared-input',
  styleUrls: ['./shared-ui-input.component.scss'],
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
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
export class SharedInputComponent implements FormViewAdapter {
  @Input() public type: 'text' | 'password' = 'text';
  @Input() public label = '';
  public value = '';
  public disabled = false;
  public touched = (): void => {}; // eslint-disable-line
  public changed = (value: string): void => {}; // eslint-disable-line

  public onChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).value;

    this.changed(value);
  }

  public setViewValue(value: string): void {
    this.value = value;
  }
  public setOnChangeCallback(fn: (value: string) => void): void {
    this.changed = fn;
  }
  public setOnTouchedCallback(fn: () => void): void {
    this.touched = fn;
  }
  public setIsDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
