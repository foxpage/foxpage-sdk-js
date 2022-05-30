import { ManagerBase } from '../../manager'
import { FoxpageHooks } from '../../hook';

export interface PluginManager<T = any> {
  loadPlugins(): void;
  getPlugins(): string[];
  hasPlugin(name: string): boolean;
  getHooks(mode?: number): FoxpageHooks | undefined;
  destroy(): void;
}
