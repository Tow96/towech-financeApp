/* eslint-disable */
export default {
  displayName: 'shared-utils-pipes',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/utils/pipes',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['jest.config.ts', 'index.ts'],
};
