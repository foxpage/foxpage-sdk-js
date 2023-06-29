import { MessageArray } from '../../common';
import { Context } from '../../context';
import { Block } from '../../manager';
import { StructureNode } from '../../structure';

export interface BlockParser {
  messages: MessageArray;
  preParse(ctx: Context, opt?: { containerGetter?: (id: string) => StructureNode | undefined }): void;
  parse(ctx: Context): void;
  parseOne(block: Block, ctx: Context): { parsed: Block; messages: string[] };
}
