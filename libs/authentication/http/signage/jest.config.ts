/* eslint-disable */
export default {
  displayName: 'authentication-http-signage',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/authentication/http/signage',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['jest.config.ts', 'index.ts'],
};
