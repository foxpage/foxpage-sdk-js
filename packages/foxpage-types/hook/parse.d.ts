import { Context } from '../context';
import { StructureNode } from '../structure';

export interface FoxpageParseHooks {
  beforeNodeParse?: (ctx: Context, node: StructureNode) => any;
  afterNodeParse?: (ctx: Context, node: StructureNode) => any;
  beforeDSLParse?: (ctx: Context) => void;
  afterDSLParse?: (ctx: Context) => any;
}
