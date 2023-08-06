/* eslint-disable */
export default {
  displayName: 'authentication-feature-sessions-data-access-jwt',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/authentication/feature-sessions/data-access-jwt',
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
  collectCoverageFrom: ['**/*.ts', '!**/*.module.ts', '!**/index.ts', '!**/jest.config.ts'],
};
