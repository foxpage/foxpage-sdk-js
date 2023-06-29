import { ContentDetail } from '../../content';
import { StructureNode } from '../../structure';
import { ManagerBase } from '..';

export interface Template extends ContentDetail<StructureNode> {}

export interface TemplateManager<T = Template> extends ManagerBase<T> {
  addTemplate(template: Template): void;
  freshTemplates(templateIds?: string[]): Promise<Template[]>;
  getTemplate(templateId: string): Promise<Template | undefined>;
  getTemplates(templateIds: string[]): Promise<Template[]>;
  removeTemplates(templateIds: string[]): void;
}
