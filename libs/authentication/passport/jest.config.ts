/* eslint-disable */
export default {
  displayName: 'authentication-middleware',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/authentication/middleware',
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!**/index.ts', '!**/jest.config.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
};