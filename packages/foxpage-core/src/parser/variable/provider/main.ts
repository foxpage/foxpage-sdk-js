import { SystemVariableProvider, VariableContext } from '@foxpage/foxpage-types';

import * as defaults from './sys';

const systemVariableProviderMap = new Map<string, SystemVariableProvider>();

/**
 * register sys variable
 * @param name sys variable name
 * @param getter sys variable parser
 */
export const registerSystemVariable = <T = unknown>(
  name: string,
  getter: (context: VariableContext) => T | Promise<T>,
) => {
  systemVariableProviderMap.set(name, {
    name,
    get: getter,
  });
};

/**
 * get sys variable by variable name
 * @param name sys variable name
 * @param context variable context
 * @returns sys variable
 */
export const getSystemVariableValue = (name: string, context: VariableContext) => {
  const getter = systemVariableProviderMap.get(name);
  if (getter) {
    return getter.get(context);
  }
  throw new Error(`system variable "${name}" not supported, should be one of ${[...systemVariableProviderMap.keys()]}`);
};

/**
 * register system variable
 */
const registerSysVariable = () => {
  for (const sysVariable of Object.values(defaults)) {
    registerSystemVariable(sysVariable.name, sysVariable.get);
  }
};

registerSysVariable();

export const registerSysVariables = registerSysVariable;
