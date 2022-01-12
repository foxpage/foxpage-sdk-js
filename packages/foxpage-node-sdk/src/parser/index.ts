import { initParser } from '@foxpage/foxpage-core/lib/parser';
import { getManager } from '@foxpage/foxpage-manager';

/**
 * init resource parser
 */
export function initResourceParser() {
  const manager = getManager();
  if (!manager) {
    throw new Error('Not instanced manager');
  }

  initParser({ hooks: { variable: manager.hooks } });
}
