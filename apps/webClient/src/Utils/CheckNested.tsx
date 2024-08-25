/**checkNested.js
 * Function obtained from:
 * https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
 *
 * checks an object for the existance of a nested key without throwing errors
 * e.g. (
 *  foo = {level1: {level2: {level3: 'bar'}}}
 *
 *  if( foo.level1.level2.foo) returns exception
 *  checkNested(foo, 'level1', 'level2', 'foo') returns false
 * )
 */

const CheckNested = (obj: any, level: string, ...rest: string[]): boolean => {
  if (obj === undefined) return false;
  if (rest.length === 0 && Object.prototype.hasOwnProperty.call(obj, level)) return true;

  const nuLevel = rest[0];
  rest.shift();

  return CheckNested(obj[level], nuLevel, ...rest);
};

export default CheckNested;
