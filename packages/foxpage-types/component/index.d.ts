import { MessageArray } from '../common/index';
import { Application } from '../application';
import { StructureNode } from '../structure';
import { FoxpageStaticComponent } from '../hook';
import { FPPackageEntrySource } from '../manager';

export interface ComponentLoadOption {
  autoDownloadComponent?: boolean;
  useStructureVersion?: boolean;
}

export interface ComponentLoader {
  app?: Application;
  opt: ComponentLoadOption;

  load(schemas: StructureNode[]): void;
  getLoadedComponents(): Map<string, FoxpageComponent>;
  getLoadedDependencies(): Map<string, FoxpageComponent>;
  destroy(): void;
}

export interface FoxpageComponentMeta {
  // if use styled components
  useStyledComponents?: boolean;
  // mount node mark
  isMountNode?: boolean;

  isHead?: boolean;
  isBody?: boolean;

  isCSREntry?: boolean;

  [key: string]: any;
}

export interface FoxpageComponent extends FoxpageStaticComponent {
  name: string;
  type?: string;
  version?: string;
  browserURL: string;
  debugURL: string;
  nodeURL: string;
  cssURL: string;
  source?: FPPackageEntrySource;
  meta: FoxpageComponentMeta;
  supportSSR: boolean;
  factory?: any;
  dependencies?: string[];
  messages?: MessageArray;
  isBuiltinComponent?: boolean;
}

export interface ComponentNodeInjectProps {
  $locale?: string;
  $runtime: {
    isServer: boolean;
    isBrowser: boolean;
    clientType: 'server' | 'client';
  };
  $eid: string;
  $ename: string;
  $elabel: string;
  $etype: string;
  $dsl: {
    id: string;
    name?: string;
    fileId?: string;
    version?: string | number;
    appId: string;
    structure: {
      id: string;
      name: string;
      label: string;
      type: string;
      version?: string;
    };
  };
}
