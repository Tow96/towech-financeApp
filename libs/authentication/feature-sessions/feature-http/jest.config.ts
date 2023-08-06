/* eslint-disable */
export default {
  displayName: 'authentication-feature-sessions-feature-http',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/authentication/feature-sessions/feature-http',
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
  collectCoverageFrom: ['**/*.ts', '!**/*.module.ts', '!**/index.ts', '!**/jest.config.ts'],
};
