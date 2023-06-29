import { Context } from '../context';

export interface FoxpageContextHooks {
  beforeContextCreate?: (ctx: Context) => void;
  afterContextCreate?: (ctx: Context) => void;
}
