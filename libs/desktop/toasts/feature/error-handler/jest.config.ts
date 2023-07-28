/* eslint-disable */
export default {
  displayName: 'desktop-toasts-feature-error-handler',
  preset: '../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../../coverage/libs/desktop/toasts/feature/error-handler',
  collectCoverageFrom: ['**/*.ts', '!**/index.ts', '!**/jest.config.ts'],
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
