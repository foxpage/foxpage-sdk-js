import { initFramework, loadInitialState } from './loaders';

function bootstrap() {
  const initState = loadInitialState();
  // console.info('[init]', initState);
  const initPromiseChain: Promise<any> = Promise.resolve();
  initPromiseChain
    // init browser framework
    .then(() => initFramework(initState))
    // init
    .then(() => {
      return (require('./init') as typeof import('./init')).init(initState);
    })
    .catch(error => {
      console.error('bootstrap fail.', error.stack);
    });
}

bootstrap();
