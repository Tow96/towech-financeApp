/* eslint-disable */
export default {
  displayName: 'shared-utils-models',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/shared/utils/models',
  collectCoverageFrom: ['**/*.ts', '!**/index.ts', '!**/jest.config.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
};
