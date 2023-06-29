import { handleFrameReady, handlePostNodeRect, listener } from '@foxpage/foxpage-iframe-actions';

import { handlers } from './eventHandlers';
import { InitialState } from './interface';
import { States } from './states';

export const init = (_: InitialState) => {
  window.addEventListener('message', event => {
    listener(event, handlers);
  });
  window.addEventListener('resize', () => {
    const selectNode = States.getSelected();
    if (selectNode) {
      const element = document.getElementById(selectNode.id);
      if (element) {
        handlePostNodeRect?.(element.getBoundingClientRect());
      }
    }
  });
  window.addEventListener('scroll', () => {
    const selectNode = States.getSelected();
    if (selectNode) {
      const element = document.getElementById(selectNode.id);
      if (element) {
        handlePostNodeRect?.(element.getBoundingClientRect());
      }
    }
  });
  handleFrameReady();
  // console.info('init listeners');
};
