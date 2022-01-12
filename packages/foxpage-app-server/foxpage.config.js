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
      plugins: ['@foxpage/foxpage-plugin-react-render', '@foxpage/foxpage-plugin-react-helmet'],
    },
  ],
  dataService: { host: 'http://server.foxfamily.io/' },
  // plugins
  plugins: ['@foxpage/foxpage-plugin-function-parse', '@foxpage/foxpage-plugin-urlquery-parse'],
  // common plugin dir, contain root and apps
  commonPluginDir: process.env.FOXPAGE_ENV === 'dev' ? join(process.cwd(), '../../') : '',
  logger: {
    level: LOGGER_LEVEL.ERROR
  }
};
