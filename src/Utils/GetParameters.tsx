/** GetParameters.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Utility that receives the string of parameters and gets the values
 */
const GetParameters = (params: string, value: string): string | null => {
  // If the string is null or empty, returns null
  if (params === null || params.match(/^ *$/) !== null) return null;

  // Splits the string every ? symbol
  const cleanParams = params.substring(1).split('&');

  // Reads every param looking for the requested one.
  for (let i = 0; i < cleanParams.length; i++) {
    if (cleanParams[i].split('=')[0] === value) return cleanParams[i].split('=')[1];
  }

  return null;
};

export default GetParameters;
