import html2canvas from 'html2canvas';

import { RenderStructureNode } from '@foxpage/foxpage-client-types';
import {
  handleDragOverReceived,
  handleDropReceived,
  handleFrameLoaded,
  handleInitiated,
  handlePageCaptured,
  handlePostNodeRect,
  ListenerHandlers,
} from '@foxpage/foxpage-iframe-actions';

import { InitialState } from './interface';
import { getState, refreshState } from './loaders';
import { refresh } from './refresh';
import { generateKey, initModules, States } from './states';
import { getDropIn } from './utils';

export const handlers: ListenerHandlers = {
  handleOutSelectNode: (node: RenderStructureNode) => {
    const element = document.getElementById(node.id);
    States.setSelected(node);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      handlePostNodeRect(element.getBoundingClientRect());
    }
  },
  handleDropComponent: (data: { node: string; position: [number, number] }) => {
    // const dropped = JSON.parse(data);
    let placement = 'before';
    const { node, position } = data;
    const dropped = JSON.parse(node);

    const { dropIn, dropInElement } = getDropIn(position);

    if (dropInElement) {
      const { top: rectTop, height } = dropInElement.getBoundingClientRect();
      const delta = position[1] - rectTop;
      if (delta * 2 > height) {
        placement = 'after';
      }
    }

    handleDropReceived?.({
      placement: placement,
      dragInfo: dropped,
      dropIn: dropIn?.detail.node as unknown as RenderStructureNode,
      dropInId: dropIn?.detail.node.id,
      noUpdate: true,
    });
  },
  handleDSLChange: dsl => {
    // init new state
    // get rootNode for csr
    // TODO:
    // console.info('handle dsl', dsl);
    const componentMaps = States.getComponentMap();

    const states = getState();
    const structureMap = {} as InitialState['structureMap'];
    const componentNameVersions: string[] = [];
    states.structures = dsl;
    states.structures.forEach(item => {
      structureMap[item.id] = item;
      componentNameVersions.push(generateKey(item.name, item.version));
    });
    states.componentNameVersions = componentNameVersions;
    states.structureMap = structureMap;

    states.modules = initModules(componentMaps, componentNameVersions);
    // update state & rerender
    doRefresh(states);
  },
  handleDragOver: position => {
    let placement = 'before' as 'before' | 'after' | 'in';
    const [, droppedY] = position;
    const { dropIn, dropInElement } = getDropIn(position);
    if (dropIn && dropInElement) {
      const { top: rectTop, height } = dropInElement.getBoundingClientRect();
      const delta = droppedY - rectTop;
      if (delta * 2 > height) {
        placement = 'after';
      }
      handleDragOverReceived({ rect: dropInElement.getBoundingClientRect(), placement });
    }
  },
  handlePostInitData: ({ zoom, componentMap, rootNode, config }) => {
    // console.info('handle post init data', rootNode, componentMap);
    const states = getState();
    States.setConfig(config || {});
    States.setZoom(zoom);
    States.setComponentMap(componentMap);
    states.root = rootNode?.id || '';
    refreshState(states as any);
    handleInitiated();
  },
  handleZoomChange: (zoom: number) => {
    States.setZoom(zoom);
    const body = document.querySelector('body');
    if (body) {
      if (zoom !== 1) {
        body.style.transform = `scale(${zoom})`;
      } else {
        body.style.removeProperty('transform');
      }
    }
    const selectNode = States.getSelected();
    if (selectNode) {
      const element = document.getElementById(selectNode.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        handlePostNodeRect(element.getBoundingClientRect());
      }
    }
  },
  handlePageCapture: (versionId: string) => {
    const body = document.querySelector('body');
    if (body) {
      html2canvas(body, { allowTaint: true, useCORS: true }).then(canvas => {
        const base64img = canvas.toDataURL('image/jpeg', 0.1);
        handlePageCaptured(base64img, versionId);
      });
    }
  },
};

const doRefresh = (states: InitialState) => {
  refresh(states).then(() => {
    handleFrameLoaded();
    setTimeout(() => {
      const selectNode = States.getSelected();
      if (selectNode) {
        const element = document.getElementById(selectNode.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          handlePostNodeRect(element.getBoundingClientRect());
        }
      }
    }, 300);
  });
};
