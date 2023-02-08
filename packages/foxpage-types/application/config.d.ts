import { SSRConfig } from "../ssr";
import { FoxRoute } from "./route";

export interface AppConfig {
  // source update schedule
  'schedule.enable'?: boolean;
  'schedule.interval'?: number;
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
}
