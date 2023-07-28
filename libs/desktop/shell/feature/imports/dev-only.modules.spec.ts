import { devOnlyModulesImport as dev } from './dev-only.modules';
import { devOnlyModulesImport as prod } from './dev-only.modules.prod';

describe('dev only modules', () => {
  test('The production modules must be empty', () => {
    expect(prod.length).toBe(0);
  });

  test('The dev modules must have at least one module', () => {
    expect(dev.length).toBeGreaterThan(0);
  });
});
