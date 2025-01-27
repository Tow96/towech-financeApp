/** ConditionalClasses.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Util that takes an object and converts it into a string
 */

export const classNames = (input: Record<string, boolean>): string =>
  Object.keys(input)
    .map((key) => (input[key] ? key : ''))
    .join(' ')
    .replace(/  +/g, ' ')
    .trim();
