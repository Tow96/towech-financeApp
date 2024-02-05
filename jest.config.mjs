// const nextJest = require('next/jest');

// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: './',
// });

// // Add any custom config to be passed to Jest
// /** @type {import('jest').Config} */
// const config = {
//   // Add more setup options before each test is run
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   testEnvironment: 'node',
//   preset: 'ts-jest',
//   collectCoverageFrom: [
//     '**/src/**/*.{js,jsx,ts,tsx}',
//     '!**/node_modules/**',
//     '!**/.next/**',
//     '!**/coverage/**',
//     '!**/__mocks__/**',
//   ],
// };

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// module.exports = createJestConfig(config);
import nextJest from "next/jest.js";
const createJestConfig = nextJest({
  dir: './'
})

const clientTestConfig = {
  displayName: 'client',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/client/**/*.[jt]s?(x)'],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
}

const serverTestConfig = {
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/server/**/*.[jt]s?(x)'],
}

/** @type {import('jest').Config} */
const config = {
  projects: [await createJestConfig(clientTestConfig)(), await createJestConfig(serverTestConfig)()],
  collectCoverageFrom: [
    '**/src/**/*.[jt]s?(x)',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/__mocks__/**',
    '!**/*.spec.[jt]s?(x)'
  ],
}

export default config;

