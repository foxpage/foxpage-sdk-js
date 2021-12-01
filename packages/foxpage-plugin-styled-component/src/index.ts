import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { createElements, renderWithStyledComponents } from './main';

/**
 * register function parser plugin
 * @returns function parser
 */
const styledComponentHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      afterPageBuild: createElements,
      beforePageRender: renderWithStyledComponents,
    },
  };
};

export default styledComponentHandler;
