import { SSRConfig } from "../ssr";

export interface AppConfig {
  // source update schedule
  'schedule.enable'?: boolean;
  'schedule.interval'?: number;
  // plugins
  plugins?: string[];
  virtualPath?: string;
  debugger?: {
    enable?: boolean;
    url?: string | ((req: any) => string);
  };
  visualEditor?: {
    enable?: boolean;
    url?: string | ((req: any) => string);
  };
  ssr?: SSRConfig;
  locale?: string;
}
