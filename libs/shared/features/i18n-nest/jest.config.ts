/* eslint-disable */
export default {
  displayName: 'shared-features-i18n-nest',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/features/i18n-nest',
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!**/index.ts', '!**/jest.config.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov', 'json'],
};
