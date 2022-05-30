import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { handleParsePage } from './main';

const parsePageHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerRouter: handleParsePage,
    },
  };
};

export default parsePageHandler;
