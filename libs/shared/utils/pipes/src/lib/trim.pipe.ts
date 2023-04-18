/** trim.pipe.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Pipe that trims all the strings that pass through it
 */
/* eslint-disable */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any) {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }

  transform(values: any, { type }: ArgumentMetadata) {
    if (this.isObj(values) && type === 'body') {
      return this.trim(values);
    } else {
      return values;
    }
  }
}
