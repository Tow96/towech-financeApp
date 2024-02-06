import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const clientTestConfig = await createJestConfig({
  displayName: 'client',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/client/**/*.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
})();

const serverTestConfig = await createJestConfig({
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/server/**/*.[jt]s?(x)'],
})();



/** @type {import('jest').Config} */
const config = {
  projects: [clientTestConfig, serverTestConfig],
  collectCoverageFrom: [
    '**/src/**/*.[jt]s?(x)',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/__mocks__/**',
    '!**/*.spec.[jt]s?(x)',

  ],
};

export default config;
