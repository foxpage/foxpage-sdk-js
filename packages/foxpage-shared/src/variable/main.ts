import _ from 'lodash';
import shortId from 'shortid';

import { ContentDetail, Variable } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../content';

/**
 * create a sys variable by name
 * @param name variable name
 * @returns sys variable
 */
export const createSysVariable = (name: string, props: Record<string, any> = {}) => {
  const variable: Variable = {
    id: 'builtin_variable_' + shortId(),
    schemas: [{ name: `__context:${name}`, type: 'data.sys', props }],
    // relation: {},
  };
  return variable;
};

/**
 * get sys variable name list
 * @param contentInfo content infos
 * @returns sys variable name list
 */
export const getSysVariables = (contentInfo: Record<string, ContentDetail[]>) => {
  let variables: string[] = [];

  Object.keys(contentInfo).forEach(key => {
    contentInfo[key].forEach(content => {
      const instance = new ContentDetailInstance(content);
      if (instance.sysVariables?.length) {
        variables = _.union(variables, instance.sysVariables);
      }
    });
  });

  return variables;
};
