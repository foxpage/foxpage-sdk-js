import { isNotNill } from '@foxpage/foxpage-shared';

import { INITIAL_STATE_SCRIPT_ID, WINDOW_INITIAL_KEY } from '../constant';
import { indexArray } from '../helper';
import { InitialState } from '../interface';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export function initInitialState(data: InitialState) {
  const structureMap = indexArray(data.structures, 'id');
  return { ...data, structureMap } as InitialState;
}

export function loadInitialState(): InitialState {
  try {
    const win: any = window;
    if (typeof win[WINDOW_INITIAL_KEY] !== 'object') {
      const jsonScriptEl = document.getElementById(INITIAL_STATE_SCRIPT_ID);
      if (jsonScriptEl) {
        const json = jsonScriptEl.innerText;
        const data: InitialState = JSON.parse(json);
        const state: InitialState = initInitialState(data);
        // inject to window
        window[WINDOW_INITIAL_KEY] = state;
      } else {
        throw new Error('miss initial state');
      }
    }
    return window[WINDOW_INITIAL_KEY];
  } catch (error) {
    console.error('load initialState fail', error);
    throw error;
  }
}

export function refreshState(newData: InitialState): InitialState {
  const initState = window[WINDOW_INITIAL_KEY];
  if (initState && isNotNill(initState)) {
    const state: InitialState = initInitialState(newData);
    window[WINDOW_INITIAL_KEY] = state;
  }
  return window[WINDOW_INITIAL_KEY];
}

export function getState() {
  return (window[WINDOW_INITIAL_KEY] || {}) as InitialState;
}
