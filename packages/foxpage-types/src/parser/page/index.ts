import { MessageArray } from '../../common';
import { Context } from '../../context';
import { Page } from '../../manager';
import { StructureNode } from '../../structure';

export interface PageParser {
  page: Page;
  templateSchemasMap: Map<string, StructureNode>;
  messages: MessageArray;

  preParse(ctx: Context): void;
  parse(ctx: Context): { parsed: Page; messages: string[] };
  getTemplateSchemas(templateId: string): StructureNode | undefined;
  getBlockSchemas(blockId: string): StructureNode | undefined;
}

export interface ParsedDSL {
  id: string;
  schemas: StructureNode[] | undefined;
}
