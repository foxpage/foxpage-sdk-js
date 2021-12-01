const { join } = require('path');

// dev config
module.exports = {
  apps: [
    {
      appId: 'appl_yqfu8BI1BRe15fs',
      configs: {
        // 'schedule.interval': 10 * 1000,
      },
      // app plugins
      plugins: ['@foxpage/foxpage-plugin-react-render', '@foxpage/foxpage-plugin-react-helmet'],
    },
  ],
  // dataService: { host: 'http://10.32.114.170:50000' },
  dataService: { host: 'http://api.foxfamily.io' },
  // plugins
  plugins: ['@foxpage/foxpage-plugin-function-parse'],
  // common plugin dir, contain root and apps
  commonPluginDir: process.env.FOXPAGE_ENV === 'dev' ? join(process.cwd(), '../../') : ''
};
