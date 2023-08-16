/** form.directive.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Directive that allows the reactive forms to manipulate the store
 */
import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IForm } from './types';

@Directive({
  selector: '[patchFormGroupValues]',
  standalone: true,
})
export class PatchFormGroupValuesDirective<T> {
  @Input() formGroup?: FormGroup<IForm<T>>;
  @Input()
  set patchFormGroupValues(val: T | undefined) {
    if (!this.formGroup || !val) return;
    this.formGroup.patchValue(val, { emitEvent: false });
  }
}
