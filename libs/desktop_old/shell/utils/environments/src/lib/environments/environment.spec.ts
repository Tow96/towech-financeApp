import { environment as local } from './environment';
import { environment as prd } from './environment.prod';

describe('environments', () => {
  let properties: string[];
  beforeAll(() => {
    properties = Object.keys(local).sort();
  });

  test('PRD must have the same properties as the base', () => {
    expect(Object.keys(prd).sort()).toEqual(properties);
  });
});
