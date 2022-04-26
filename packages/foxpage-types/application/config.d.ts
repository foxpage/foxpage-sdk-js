export interface AppConfig {
  // source update schedule
  'schedule.enable'?: boolean;
  'schedule.interval'?: number;
  // plugins
  plugins?: string[];
  virtualPath?: string;
  debugger: {
    url: string;
  };
}
