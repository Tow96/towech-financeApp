/* eslint-disable */
export default {
  displayName: 'shared-feature-mongo',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/feature/mongo',
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/index.ts',
    '!**/jest.config.ts',
    '!**/mocks/**',
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
};
