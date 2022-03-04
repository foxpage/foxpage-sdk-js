import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { handleAfterPageRender, handleBeforePageRender } from './main';

const debuggerHandler = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      beforePageRender: handleBeforePageRender,
      afterPageRender: handleAfterPageRender,
    },
  };
};

export default debuggerHandler;
