const { join } = require('path');
const { usePlugins } = require('@foxpage/foxpage-plugin-common-base');

const { appPlugins, commonPlugins } = usePlugins();

// foxpage config
module.exports = {
  apps: [
    {
      appId: 'appl_O6Rj7weDnMQ5y5o',
      config: {
        ssr: {
          enable: false,
        }
      },
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
};
