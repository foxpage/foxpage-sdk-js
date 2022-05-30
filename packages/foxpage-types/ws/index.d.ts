import { PackageNamedVersion } from '../manager';

type ContentUpdateInfo = Partial<{
  updates: string[];
  removes: string[];
}>;

type PackageUpdateInfo = Partial<{
  updates: PackageNamedVersion[];
  removes: PackageNamedVersion[];
}>;

export type ResourceUpdateInfo = Partial<
  Record<
    'template' | 'page' | 'variable' | 'condition' | 'function' | 'component' | 'tag' | 'file' | 'mock',
    ContentUpdateInfo
  >
>;
