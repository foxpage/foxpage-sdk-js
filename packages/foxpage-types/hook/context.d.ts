import { Context } from '../context';

export interface FoxpageContextHooks {
  afterContextCreate?: (ctx: Context) => void;
}
