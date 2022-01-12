import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { getURLVar } from './main';

/**
 * register urlobj parser plugin
 * @returns urlobj parser
 */
const urlObjParser = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerVariableParser: () => {
        return {
          type: 'data.urlobj',
          parse: getURLVar,
        };
      },
    },
  };
};

export default urlObjParser;
