export interface FoxpageAppIgniteHooks {
  beforeIgnite?: () => void;
  onInitLogger?: () => Promise<any>;
  afterIgnite?: () => void;
}
