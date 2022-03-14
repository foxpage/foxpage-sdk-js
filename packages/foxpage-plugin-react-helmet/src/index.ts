import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { createHeadManager, renderWithHelmet } from './main';

export * from './main';

/**
 * helmet handle plugin
 *
 * @returns helmet collector
 */
const helmetCollector = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      afterContextCreate: createHeadManager,
      beforePageRender: renderWithHelmet,
    },
  };
};

export default helmetCollector;
