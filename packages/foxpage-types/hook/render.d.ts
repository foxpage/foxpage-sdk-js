import { Context } from '../context';
import { StructureNode } from '../structure'

export interface FoxpageRenderHooks {
  beforePageRender?: (ctx: Context) => Promise<Context['page']['schemas']>;
  onPageRender?: (ctx: Context, dsl: StructureNode[]) => Promise<string>;
  afterPageRender?: (ctx: Context, html: string) => string;
  onRenderError?: (ctx: Context, error?: Error) => Promise<void>;
}
