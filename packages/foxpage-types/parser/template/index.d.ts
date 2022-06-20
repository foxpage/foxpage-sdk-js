import { Context } from '../../context';
import { Template } from '../../manager';
import { StructureNode } from '../../structure';

export interface TemplateParser {
  templates: Template[];

  preParse(ctx: Context, opt?: { containerGetter?: (id: string) => StructureNode | undefined }): void;
  parse(ctx: Context);
}
