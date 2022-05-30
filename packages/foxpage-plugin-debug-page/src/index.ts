import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { handleRegisterRouter } from './main';

const previewHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerRouter: handleRegisterRouter,
    },
  };
};

export default previewHandler;
