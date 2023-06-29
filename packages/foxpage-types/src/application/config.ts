import { SSRConfig } from '../ssr';

import { FoxRoute } from './route';
import { SecurityConfig } from './security';

export interface AppConfig {
  // source update schedule
  'schedule.enable'?: boolean;
  'schedule.interval'?: number;
  // package
  package?: {
    loadStrategy?: 'all' | 'loadOnIgnite';
  };
  // plugins
  plugins?: string[];
  virtualPath?: string;
  debugger?: {
    enable?: boolean;
    host?: string;
    url?: string | ((req: any) => string);
  };
  visualEditor?: {
    enable?: boolean;
    host?: string;
    url?: string | ((req: any) => string);
  };
  ssr?: SSRConfig;
  locale?: string;
  routes?: FoxRoute[];
  security?: SecurityConfig;
}
