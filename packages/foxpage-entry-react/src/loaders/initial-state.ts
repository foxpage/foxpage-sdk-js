import { BrowserInitialState } from '@foxpage/foxpage-types';

import { INITIAL_STATE_SCRIPT_ID, WINDOW_INITIAL_KEY } from '../constant';
import { indexArray } from '../helper/utils';
import { InitialState } from '../interface';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export function initInitialState(data: BrowserInitialState) {
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
        const data: BrowserInitialState = JSON.parse(json);
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
