// Tested elements
import { APP_CONFIG, provideDesktopEnvironment } from './environment.service';
import { environment as base } from './environment';
import { environment as prd } from './environment.prod';

describe('environments', () => {
  let properties: string[];
  beforeAll(() => {
    properties = Object.keys(base).sort();
  });

  test('PRD must have the same properties as the base', () => {
    expect(Object.keys(prd).sort()).toEqual(properties);
  });
});

describe('environment service', () => {
  it('Should get a provider containing the service', () => {
    expect(provideDesktopEnvironment()).toEqual({
      provide: APP_CONFIG,
      useValue: base,
    });
  });
});
