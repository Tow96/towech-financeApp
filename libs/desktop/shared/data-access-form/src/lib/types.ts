/** types.ts
 * Copyright (c) 2023, Towechlabs
 *
 * All the types used in the library
 */
import { AbstractControl } from '@angular/forms';

export type FormType<T> = { [K in keyof T]: T[K] | null } | null;
export type IForm<T> = { [K in keyof T]: AbstractControl<T[K] | null> } | null;
