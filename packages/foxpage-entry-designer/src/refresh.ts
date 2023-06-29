import { createApp } from './app';
import { InitialState } from './interface';
import { refreshState } from './loaders';
import { render } from './render';

export const refresh = (data: InitialState) => {
  const start = +new Date();
  const newState = refreshState(data);

  return createApp(newState)
    .then(({ element }) => {
      render(element, newState);
      console.log('init success. cost:', +new Date() - start);
    })
    .catch(err => {
      console.error('init fail.', err);
    });
};
