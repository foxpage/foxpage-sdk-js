import { ManagerOption } from '../manager';
export interface FoxpageAppIgniteHooks {
  beforeIgnite?: () => void;
  onInitLogger?: () => Promise<any>;
  afterIgnite?: () => void;
  afterManagerCreate?: (config?: ManagerOption) => Promise<Array<ManagerOption> | ManagerOption>;
}
