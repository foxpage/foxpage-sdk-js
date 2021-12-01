const { join } = require('path');

/** @type {jest.ProjectConfig} */
const config = {
  rootDir: __dirname,
  name: 'foxpage-react',
  displayName: 'foxpage-react',
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
