const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.pnpm-store/'],
};

module.exports = createJestConfig(config);
