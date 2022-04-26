import foxpageRequestHandler from './main';

export * from './proxy';
export * from './static';
export { foxpageRequestHandler as foxpageMiddleWare } from './main';

export default foxpageRequestHandler;
