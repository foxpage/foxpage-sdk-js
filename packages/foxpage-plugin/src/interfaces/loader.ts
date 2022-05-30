import { Mode } from '../mode';

import { FoxpagePlugin } from './plugin';

export interface PluginLoaderOptions {
  baseDir: string;
  plugins?: string[];
  api: Record<string, unknown>;
  mode?: Mode;
}

export interface PluginLoader {
  baseDir: string;
  list: string[];
  api: PluginLoaderOptions['api'];
  visitors?: FoxpagePlugin['visitor'];
  load(): void;
  registerPlugin(name: string): void;
  unregisterPlugin(name: string): void;
  getPlugin(name: string): FoxpagePlugin | undefined;
  getList(): string[];
  hasPlugin(name: string): boolean;
  mergeVisitors(): void;
  getHooks(mode?: Mode): Record<string, any>;
  destroy(): void;
}
