import { getWindow } from '../config';
import { ModuleLoaderFn } from '../loader';

function getDocument() {
  const win = getWindow();
  return win.document;
}

function findAssetElement(tag: 'script', targetLink: string): HTMLScriptElement | undefined;
function findAssetElement(tag: 'link', targetLink: string): HTMLLinkElement | undefined;
function findAssetElement(tag: 'link' | 'script', targetLink: string) {
  const els = getDocument().getElementsByTagName(tag);
  for (let index = 0; index < els.length; index++) {
    const element = els[index];
    const link = (element as HTMLScriptElement).src || (element as HTMLLinkElement).href;
    if (link === targetLink) {
      return element;
    }
  }
}

function waitElementLoad(element: HTMLLinkElement | HTMLScriptElement): Promise<undefined> {
  return new Promise((resolve, reject) => {
    element.addEventListener('load', () => resolve(undefined));
    element.addEventListener('error', reject);
    element.addEventListener('abort', reject);
  });
}

function createCssElement(link: string) {
  const element = getDocument().createElement('link');
  element.setAttribute('href', link);
  element.setAttribute('rel', 'stylesheet');
  return element;
}

function createScriptElement(link: string) {
  const element = getDocument().createElement('script');
  element.src = link;
  element.async = true;
  return element;
}

function setElementDataAttr(element: HTMLElement, dataInfo: Record<string, string>) {
  Object.keys(dataInfo).forEach(k => {
    element.setAttribute(`data-${k}`, dataInfo[k]);
  });
}

export function loadStyle(link: string, dataInfo: Record<string, string> = {}) {
  let element = findAssetElement('link', link);

  if (!element) {
    const head = getDocument().getElementsByTagName('head')[0];
    element = createCssElement(link);
    setElementDataAttr(element, dataInfo);
    head.appendChild(element);
  }

  return Promise.resolve();
}

export function loadScript(link: string, dataInfo: Record<string, string> = {}) {
  let element = findAssetElement('script', link);

  if (!element) {
    const head = getDocument().getElementsByTagName('head')[0];
    element = createScriptElement(link);
    setElementDataAttr(element, dataInfo);
    head.appendChild(element);
  }

  return waitElementLoad(element);
}

export const loadStyleModule: ModuleLoaderFn = mod => {
  return loadStyle(mod.url, {
    by: 'foxpage',
    moduleId: mod.id,
  });
};

export const loadScriptModule: ModuleLoaderFn = mod => {
  return loadScript(mod.url, {
    by: 'foxpage',
    moduleId: mod.id,
  });
};
