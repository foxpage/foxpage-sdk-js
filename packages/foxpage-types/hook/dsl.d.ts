import { Context } from '../context';

export interface FoxpageDSLHooks {
  beforeDSLFetch?: (ctx: Context) => any;
  afterDSLFetch?: (ctx: Context) => any;
}
