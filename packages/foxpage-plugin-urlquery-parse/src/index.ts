import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { FoxpageHooks } from '@foxpage/foxpage-types';

import { getURLQueryVar } from './main';

/**
 * register url query parser plugin
 * @returns urlquery parser
 */
const urlQueryParser = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerVariableParser: () => {
        return {
          type: 'data.urlquery',
          parse: getURLQueryVar,
        };
      },
    },
  };
};

export default urlQueryParser;
