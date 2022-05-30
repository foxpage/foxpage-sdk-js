const { join } = require('path');

/** @type {jest.ProjectConfig} */
const config = {
  rootDir: __dirname,
  name: 'foxpage-middleware-koa',
  displayName: 'foxpage-middleware-koa',
  // setupFiles: ['<rootDir>/config/jest/setup.ts'],
  testRegex: 'test/.*\\.(test|spec)\\.(ts|tsx)$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: join(__dirname, 'tsconfig.test.json')
    }
  },
};

module.exports = config;
