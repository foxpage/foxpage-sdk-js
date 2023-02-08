const { usePlugins } = require('@foxpage/foxpage-plugin-common-base');
const { LOGGER_LEVEL } = require('@foxpage/foxpage-shared');

const plugins = usePlugins();

module.exports = {
  apps: [
    {
      appId: 'appl_O6Rj7weDnMQ5y5o', // foxpage平台上的appid
      configs: {},
      plugins: [...plugins.appPlugins],
    },
  ],
  plugins: [...plugins.commonPlugins],
  dataService: {
    host: 'http://localhost:50000', //server host
  },
  libraries: {
    react: {
      fileName: 'react',
    },
    'react-dom': {
      fileName: 'react-dom',
    },
    // 'react-helmet': {
    //   fileName: 'react-helmet',
    //   entry: 'lib/Helmet.js', // default: index.js
    // },
    // 'styled-components': {
    //   fileName: 'styled-components',
    //   entry: 'dist/styled-components.cjs.js', // default: index.js
    // },
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
