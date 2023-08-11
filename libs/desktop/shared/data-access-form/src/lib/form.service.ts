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
import { FormType, IForm } from './types';

// TODO fix types for initial state and form
export class StateAdaptFormService<T> {
  private initialState: T;
  public form: FormGroup<IForm<T>>;
  public store;

  private formChanges$: Observable<Action<FormType<any>, string>>; // eslint-disable-line
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
  public constructor(
    name: string,
    clear: Observable<Action<void, string>>,
    submit: Observable<Action<any, string>>, // eslint-disable-line
    initialState: any, // eslint-disable-line
    validators: Record<string, ValidatorFn[]> = {}
  ) {
    this.initialState = initialState;

    const holder: IForm<T> = {} as IForm<T>;
    Object.keys(initialState).forEach(key => {
      holder![key as keyof T] = new FormControl(initialState[key], { validators: validators[key] }); // eslint-disable-line
    });
    this.form = new FormGroup<IForm<T>>(holder);

    this.formChanges$ = this.form.valueChanges.pipe(
      debounceTime(150),
      toSource(`[${name}] Change Form`)
    );

    this.store = adaptNgrx([name, initialState, this.adapter], {
      clear,
      change: this.formChanges$,
      submit,
    });
  }
}
