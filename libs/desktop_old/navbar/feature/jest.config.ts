/* eslint-disable */
export default {
  displayName: 'desktop-navbar-feature',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../coverage/libs/desktop/navbar/feature',
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!**/index.ts', '!**/jest.config.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};