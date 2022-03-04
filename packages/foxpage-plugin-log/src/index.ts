import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import console from './main';

const consoleHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      onInitLogger: async () => {
        return [console];
      },
    },
  };
};

export default consoleHandler;
