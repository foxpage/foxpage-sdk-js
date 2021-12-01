import { Context } from '../context';

export interface FoxpageRenderHooks {
  beforePageRender?: (ctx: Context) => Promise<Context['page']['schemas']>;
  onPageRender?: (dsl: StructureNode[], ctx: Context) => Promise<string>;
  afterPageRender?: (ctx: Context, html: string) => string;
}
