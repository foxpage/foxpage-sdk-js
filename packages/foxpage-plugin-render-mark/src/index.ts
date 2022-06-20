import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { handleBeforePageRender, handleRegisterRouter } from './main';

const debugPageHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      beforePageRender: handleBeforePageRender,
      registerRouter: handleRegisterRouter,
    },
  };
};

export default debugPageHandler;
