import { Context } from '../context';
import { Page } from '../manager';

export interface FoxpageDSLHooks {
  beforeDSLFetch?: (ctx: Context) => Promise<any>;
  afterDSLFetch?: (ctx: Context, page?: Page) => Promise<Page | null>;
}
