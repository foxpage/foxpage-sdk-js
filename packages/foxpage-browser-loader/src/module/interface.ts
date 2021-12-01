import { ModuleConfig } from '@foxpage/foxpage-types';

export interface ILoader<T> {
  load(name?: string, version?: string): Promise<T | undefined | null>;
}

declare global {
  interface Window {
    [key: string]: any;
  }
}

export type ModuleType = ModuleConfig['type'];

export interface IModuleSystem {
  get(name: string, version?: string): (IModule & Pick<IModuleLoader, 'status'>) | undefined;
  add(moduleName: string, config: ModuleConfig): this;
  load<T = any>(name: string, version?: string): Promise<T>;
}

export interface IModule<T = any> {
  id: string;
  name: string;
  version?: string;
  deps: string[];
  softDeps: string[];
  exports: T | undefined | null;
  // external info
  meta?: Record<string, any>;
}

export interface IModuleLoader<T = any> extends ILoader<T>, IModule<T> {
  url?: string;
  config: ModuleConfig;
  status: 'create' | 'pending' | 'success' | 'fail';
  update(cfg: Partial<ModuleConfig>): void;
}

export type ModuleStatus = IModuleLoader['status'];
