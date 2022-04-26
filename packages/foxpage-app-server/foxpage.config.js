const { join } = require('path');
const { LOGGER_LEVEL } = require('@foxpage/foxpage-shared');

// dev config
module.exports = {
  apps: [
    {
      appId: 'appl_O6Rj7weDnMQ5y5o',
      configs: {},
      // app plugins
      plugins: [
        '@foxpage/foxpage-plugin-react-render',
        '@foxpage/foxpage-plugin-react-helmet',
        '@foxpage/foxpage-plugin-visual-editor',
        '@foxpage/foxpage-plugin-debugger',
      ],
    },
  ],
  dataService: { host: 'http://foxpage-v2.fws.qa.nt.ctripcorp.com' },
  // plugins
  plugins: [
    '@foxpage/foxpage-plugin-urlquery-parse',
    '@foxpage/foxpage-plugin-urlquery-parse',
    '@foxpage/foxpage-plugin-log',
  ],
  // common plugin dir, contain root and apps
  commonPluginDir: process.env.FOXPAGE_ENV === 'dev' ? join(process.cwd(), '../../') : '',
  // library config for webpack compile static resource
  libraries: {
    react: {
      fileName: 'react',
    },
    'react-dom': {
      fileName: 'react-dom',
    },
    'react-helmet': {
      fileName: 'react-helmet',
      entry: 'lib/Helmet.js', // default: index.js
    },
    // '@foxpage/foxpage-debug-portal': {
    //   fileName: 'debugger',
    //   entry: 'dist/debug.js',
    // },
    '@foxpage/foxpage-visual-editor': {
      fileName: 'visual-editor',
      entry: 'dist/main.bundle.js',
    },
  },
  logger: {
    level: LOGGER_LEVEL.INFO,
  },
};
