import { FoxpageHooks } from '../../hook';

export interface PluginManager {
  loadPlugins(): void;
  getPlugins(): string[];
  hasPlugin(name: string): boolean;
  getHooks(mode?: number): FoxpageHooks | undefined;
  destroy(): void;
}
