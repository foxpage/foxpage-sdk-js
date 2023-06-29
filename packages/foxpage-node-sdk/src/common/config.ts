import { join } from 'path';

import { pathExists } from 'fs-extra';
import { clone, merge } from 'lodash';

import { createLogger, LOGGER_LEVEL } from '../logger';

const logger = createLogger('Config');

/**
 * Foxpage Node SDK default config
 */
const defaultConfig = {
  // foxpage applications
  apps: [
    {
      appId: '', //appl-IHrJ78GJ_aioGDo
      options: {},
    },
  ],
  // data service
  dataService: {
    host: '', //http://example.com
    path: '', // api path
  },
  // pm2 config
  pm2: {
    enable: true,
    name: '', // process name
  },
  plugins: ['@foxpage/foxpage-plugin-function-parse', '@foxpage/foxpage-plugin-urlquery-parse'],
  commonPluginDir: '',
  logger: {
    level: LOGGER_LEVEL.ERROR,
  },
};

export type FoxpageConfig = typeof defaultConfig;
let configs: FoxpageConfig = clone(defaultConfig);

const config = {
  async init() {
    try {
      const filenames = ['.foxpagerc.js', 'foxpage.config.js'];
      const tasks = filenames.map(async filename => {
        const path = join(process.cwd(), filename);
        const exist = await pathExists(path);
        return { path, exist };
      });

      const result = await (await Promise.all(tasks)).find(item => item.exist);
      if (result && result.exist) {
        const defineC = require(result.path);
        logger.info('app provider config:', JSON.stringify(defineC));
        configs = merge(configs, defineC);
        return;
      }

      const msg = 'Not provider foxpage config file';
      const err = new Error(msg);
      logger.error('config init failed.', err);
      throw err;
    } catch (e) {
      logger.error('Read define config failed:', e);
      throw e;
    }
  },
  get<K extends keyof FoxpageConfig>(key: K): FoxpageConfig[K] {
    return configs[key];
  },
};

/**
 * define config
 * @param config custom configs
 */
export const defineConfig = (config: FoxpageConfig) => {
  const defaultC = clone(defaultConfig);
  return Object.assign({}, defaultC, config);
};

export { config };
export default config;
