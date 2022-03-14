const { join } = require('path');
const { LOGGER_LEVEL } = require('@foxpage/foxpage-shared');

// dev config
module.exports = {
  apps: [
    {
      appId: 'appl_yqfu8BI1BRe15fs',
      configs: {
      },
      // app plugins
      plugins: [
        '@foxpage/foxpage-plugin-react-render',
        '@foxpage/foxpage-plugin-react-helmet',
        '@foxpage/foxpage-plugin-visual-editor',
        '@foxpage/foxpage-plugin-debugger'
      ],
    },
  ],
  // dataService: { host: 'https://api.foxfamily.io' },
  dataService: { host: 'http://10.32.114.170:50000' },
  // plugins
  plugins: ['@foxpage/foxpage-plugin-function-parse', '@foxpage/foxpage-plugin-urlquery-parse', '@foxpage/foxpage-plugin-log'],
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
      entry: 'lib/Helmet.js',
    }
  },
  logger: {
    level: LOGGER_LEVEL.INFO
  }
};
