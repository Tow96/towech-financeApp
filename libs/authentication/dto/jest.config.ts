/* eslint-disable */
export default {
  displayName: 'authentication-dto',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/authentication/dto',
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov'],
};
