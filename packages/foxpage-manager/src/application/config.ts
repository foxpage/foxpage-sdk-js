import _ from 'lodash';

import { AppConfig } from '@foxpage/foxpage-types';

/**
 * app default configs
 */
const defaultConfigs: AppConfig = {
  'schedule.enable': true,
  'schedule.interval': 1000 * 40,
  package: {
    loadStrategy: 'all',
  },
};

/**
 * init app configs
 * @returns app configs
 */
export const initAppConfig = (opt?: AppConfig) => {
  const cloned = _.cloneDeep(defaultConfigs);
  return Object.assign({}, cloned, opt);
};
