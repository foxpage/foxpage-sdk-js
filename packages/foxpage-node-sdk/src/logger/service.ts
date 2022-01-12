import config from '../common/config';

import { createLogger } from './main';

export function loggerCreate(type: string) {
  return createLogger(type, config.get('logger')?.level);
}
