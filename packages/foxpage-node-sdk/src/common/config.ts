import { join } from 'path';

import { pathExists } from 'fs-extra';
import { clone } from 'lodash';

import { createLogger, LOGGER_LEVEL } from './logger';

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
  plugins: [],
  commonPluginDir: '',
  logger: {
    level: LOGGER_LEVEL.INFO,
  },
};

export type FoxpageConfig = typeof defaultConfig;
const configs: FoxpageConfig = clone(defaultConfig);

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
        logger.debug('app provider config:', JSON.stringify(defineC));
        Object.assign(configs, defineC);
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
