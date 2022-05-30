import { BrowserInitialState, BrowserStructure, ContextOrigin, Page } from '@foxpage/foxpage-types';

import { PLACEHOLDER, SCRIPT_ID, WIN_DATA_KEY, WIN_INITIAL_KEY } from './constant';

export interface DebugState {
  origin: ContextOrigin;
  parsedDSL: Page;
  baseInfo: {
    appId: string;
    appSlug: string;
  };
  netInfo: Record<string, any>;
  variableValue?: Record<string, any>;
  conditionValue?: Record<string, any>;
}

export interface InitialState extends BrowserInitialState {
  structureMap: Record<string, BrowserStructure>;
  componentNameVersions?: Record<string, string>;
}
export interface DebugInitialState extends DebugState {}

declare global {
  interface window {
    WIN_DATA_KEY: DebugState | number;
  }
}

export const initDebugState = (data: DebugState): DebugInitialState => {
  return { ...data };
};

export function getDebugDataString() {
  const jsonScriptEl = document.getElementById(SCRIPT_ID);
  if (jsonScriptEl) {
    const jsonStr = jsonScriptEl.innerText;
    return jsonStr === PLACEHOLDER ? '' : jsonStr;
  }
  return '';
}

/**
 * get the debug state
 * @returns
 */
export const getDebugState = (): DebugState => {
  // @ts-ignore
  if (typeof window[WIN_DATA_KEY] !== 'object') {
    let data: DebugState | undefined = undefined;
    const json = getDebugDataString();
    if (json) {
      data = JSON.parse(json);
    }
    if (!json && __DEV__) {
      data = require('../mock/debug.json');
    }
    if (data) {
      initDebugState(data);
      // inject to window
      // @ts-ignore
      window[WIN_DATA_KEY] = data;
    }
    if (__DEV__) {
      console.info('debug data:', data);
    }
  }
  // @ts-ignore
  return window[WIN_DATA_KEY];
};

export const getInitialState = () => {
  // @ts-ignore
  let initialState = (window[WIN_INITIAL_KEY] as InitialState) || null;
  if (!initialState && __DEV__) {
    initialState = require('../mock/initial.json');
  }

  if (!initialState) {
    return null;
  }

  const components = initialState.modules || [];
  const nameVersionMap: Record<string, string> = {};
  components.forEach(item => {
    nameVersionMap[item.name] = item.version || '';
  });
  initialState.componentNameVersions = nameVersionMap;
  // @ts-ignore
  window[WIN_INITIAL_KEY] = initialState;

  return initialState;
};

export const getStructures = () => {
  const result = getDebugState()?.parsedDSL?.schemas || [];
  return result;
};

export const getVariables = () => {
  const { variables = [], sysVariables = [] } = getDebugState()?.origin || {};
  return variables.concat(sysVariables);
};

export const getConditions = () => {
  const result = getDebugState()?.origin?.conditions || [];
  return result;
};

export const getFunctions = () => {
  const result = getDebugState()?.origin?.functions || [];
  return result;
};

export const getPage = () => {
  const result = getDebugState()?.origin?.page || null;
  return result;
};

export const getTemplates = () => {
  const result = getDebugState()?.origin?.templates || [];
  return result;
};

export const getBaseInfo = () => {
  const result = getDebugState()?.baseInfo || {};
  return result;
};

export const getNetInfo = () => {
  const result = getDebugState()?.netInfo || {};
  return result;
};

export const getComponents = () => {
  const result = getInitialState()?.modules || [];
  return result;
};

export const getComponentVersionMap = () => {
  const result = getInitialState()?.componentNameVersions || {};
  return result;
};
