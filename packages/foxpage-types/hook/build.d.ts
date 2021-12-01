import { Context } from '../context';
import { StructureNode } from '../structure';

export interface FoxpageBuildHooks {
  beforeNodeBuild?: (ctx: Context, node: StructureNode) => any;
  afterNodeBuild?: (ctx: Context, node: StructureNode) => any;
  beforePageBuild?: (ctx: Context) => any;
  afterPageBuild?: (ctx: Context, elements: any) => any;
}
