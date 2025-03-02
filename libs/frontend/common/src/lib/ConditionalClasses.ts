/** ConditionalClasses.ts
 * Copyright (c) 2023, TowechLabs
 *
 * Util that takes an object and converts it into a string
 */

export const classNames = (input: Record<string, boolean>): string =>
  Object.keys(input)
    .map((key) => (input[key] ? key : ''))
    .join(' ')
    .replace(/  +/g, ' ')
    .trim();
