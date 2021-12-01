import { Page } from "../../manager";
import { StructureNode } from '../../structure';
import { Context } from '../../context';
import {MessageArray} from '../../common';

export interface PageParser {
  page: Page;
  templateSchemasMap: Map<string, StructureNode>;
  messages: MessageArray;

  preParse(ctx: Context): void;
  parse(ctx: Context): StructureNode[];
  getTemplateSchemas(templateId: string): StructureNode | undefined;
}

export interface ParsedDSL {
  id: string;
  schemas: StructureNode[] | undefined;
}
