/** form.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class that creates a state-adapt managed store
 */
// Libraries
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Action, createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { toSource } from '@state-adapt/rxjs';
import { Observable, debounceTime } from 'rxjs';
// Types
import { IForm } from './types';

/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any*/
export class StateAdaptFormService<T extends Record<string, any>> {
  private formChanges$;
  private initialState: T;

  store;
  form: FormGroup<IForm<T>>;
  invalidateForm() {
    const controls = this.form.controls!;
    const formKeys = Object.keys(controls);
    formKeys.forEach(key => controls[key as keyof T].markAsDirty());
  }

  private adapter = createAdapter<T>()({
    clear: () => this.initialState,
    change: (state, form) => ({ ...state, ...form }),
    submit: state => state,
    selectors: {
      form: state => state,
    },
  });

  /**
   * Creates a ngrx store using state-adapt that represents the form
   * @param {string} name - The name of the store
   * @param {Observable<void,string>} clear - The observable that will clear the form when nexted
   * @param {Observable<any,string>} submit - The observable that will trigger the submit acction
   * @param {any} initialState - The base state of the service
   * @param {Record<string, ValidatorFn[]} validators - Object indicating which properties of the initialState contain which validators
   */
  constructor(
    name: string,
    clear: Observable<Action<any, string>>,
    submit: Observable<Action<any, string>>,
    initialState: T,
    validators: Record<string, ValidatorFn[]> = {}
  ) {
    this.initialState = initialState;

    const holder: IForm<T> = {} as IForm<T>;
    Object.keys(this.initialState).forEach(key => {
      holder![key as keyof T] = new FormControl(initialState[key], {
        validators: validators[key],
      });
    });
    this.form = new FormGroup<IForm<T>>(holder);

    this.formChanges$ = this.form.valueChanges.pipe(
      debounceTime(150),
      toSource(`[${name}] Change Form`)
    );

    this.store = adaptNgrx([name, initialState, this.adapter], {
      clear,
      change: this.formChanges$ as any,
      submit,
    });
  }
}
/* eslint-enable */
