import { parser } from '@foxpage/foxpage-core';
import { FoxpagePluginApi } from '@foxpage/foxpage-types';

export const getApis = (): FoxpagePluginApi => {
  return {
    evalWithScope: parser.evalWithScope,
  };
};
