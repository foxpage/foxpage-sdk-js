import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { handleRegisterRouter } from './main';

const visualHtmlHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerRouter: handleRegisterRouter,
    },
  };
};

export default visualHtmlHandler;
