const { join } = require('path');
// const { LOGGER_LEVEL } = require('@foxpage/foxpage-shared');
const { usePlugins } = require('@foxpage/foxpage-plugin-common-base');

const { appPlugins, commonPlugins } = usePlugins();

// foxpage config
module.exports = {
  apps: [
    {
      appId: 'appl_O6Rj7weDnMQ5y5o',
      // app plugins
      plugins: [...appPlugins],
    },
  ],
  // plugins
  plugins: [...commonPlugins],
  dataService: {
    host: 'http://localhost:3000',
  },
  // common plugin dir, contain root and apps
  commonPluginDir: process.env.FOXPAGE_ENV === 'dev' ? join(process.cwd(), '../../') : '',
  // library config for webpack compile static resource
  // libraries: {
  // react: {
  //   fileName: 'react',
  // },
  // 'react-dom': {
  //   fileName: 'react-dom',
  // },
  // 'react-helmet': {
  //   fileName: 'react-helmet',
  //   entry: 'lib/Helmet.js', // default: index.js
  // },
  // '@foxpage/foxpage-debug-portal': {
  //   fileName: 'debugger',
  //   entry: 'dist/debug.js',
  // },
  // '@foxpage/foxpage-visual-editor': {
  //   fileName: 'visual-editor',
  //   entry: 'dist/main.bundle.js',
  // },
  // },
  // logger: {
  //   level: LOGGER_LEVEL.INFO,
  // },
};
