import { UmdModuleSystemOptions } from './loaders/umd';

export interface Config extends Required<UmdModuleSystemOptions> {
  // host?: string;
  win?: Window;
}

const config: Config = {
  requirejsLink: '',
  win: window,
};

export function setConfig<K extends keyof Config>(key: K, val: Config[K]): void;
export function setConfig(partial: Partial<Config>): void;
export function setConfig(partialOrKey: Partial<Config> | string, val?: any) {
  if (typeof partialOrKey === 'string') {
    config[partialOrKey as keyof Config] = val as never;
  } else {
    Object.assign(config, partialOrKey);
  }
}

export function getConfig<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}

export function getWindow() {
  return config.win || window;
}
