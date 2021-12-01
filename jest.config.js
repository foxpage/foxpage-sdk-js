/** @type {jest.ProjectConfig} */
module.exports = {
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/__mocks__/**',
    '!**/{interfaces,typings}/**',
    '!**/index.ts',
    '!**/src/{global,post-install}.ts',
    '!**/application/resources/**',
    '!**/render/debug-helper.ts',
    '!**/render/component/**',
    '!**/logger/impl/**',
    '!**/init/**',
    '!**/middleware/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov'],
  reporters: ['default'],
  transformIgnorePatterns: [
    '/es/',
    '/lib/',
    '/dist/',
    'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'js',
    'json',
  ],
  projects: [
    require('./packages/foxpage-manager/jest.config'),
    require('./packages/foxpage-shared/jest.config'),
    require('./packages/foxpage-core/jest.config'),
    require('./packages/foxpage-node-sdk/jest.config'),
    require('./packages/foxpage-js-sdk/jest.config'),
    require('./packages/foxpage-plugin/jest.config'),
    require('./packages/foxpage-transformer/jest.config'),
    require('./packages/foxpage-middleware-koa/jest.config'),
  ],
};
