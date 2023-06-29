import { NodesStore } from '../states';

export const getDropIn = (position: [number, number]) => {
  let dropIn = null;

  let dropInElement = document.elementFromPoint(...position);

  if (dropInElement) {
    while (dropInElement && !dropInElement.hasAttribute('data-node-id') && dropInElement !== document.body) {
      dropInElement = dropInElement.parentElement;
    }
    dropIn = NodesStore.allNodes().find(item => item.detail.node.id === dropInElement?.getAttribute('data-node-id'));
  }
  return { dropIn, dropInElement };
};
