/** trim.pipe.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Pipe that trims all the strings that pass through it
 */
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any) {
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'password') continue;

      if (this.isObj(values[key])) {
        values[key] = this.trim(values[key]);
        continue;
      }

      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
    return values;
  }

  transform(values: any, { type }: ArgumentMetadata) {
    if (!(this.isObj(values) && type === 'body')) return values;

    return this.trim(values);
  }
}
