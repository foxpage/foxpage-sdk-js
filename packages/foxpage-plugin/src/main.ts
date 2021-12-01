import { PluginLoaderOptions } from './interfaces';
import { PluginLoaderImpl } from './loader';

/**
 * create plugin loader
 * @param opt options
 * @returns plugin loader instance
 */
export const createPluginLoader = (opt: PluginLoaderOptions) => {
  const loader = new PluginLoaderImpl(opt);
  return loader;
};
