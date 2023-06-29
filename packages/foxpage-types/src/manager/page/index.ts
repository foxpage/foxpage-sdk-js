import { ContentDetail } from '../../content';
import { ContentRelationInfo } from '../../content';
import { StructureNode } from '../../structure';
import { ManagerBase } from '..';

export interface Page extends ContentDetail<StructureNode> {}

export interface PageManager<T = Page> extends ManagerBase<T> {
  addPage(page: Page): void;
  removePages(pageIds: string[]): void;
  getPage(pageId: string): Promise<Page | undefined>;
  getPages(pageIds: string[]): Promise<Page[]>;
  getDraftPages(pageIds: string[]): Promise<ContentRelationInfo[]>;
  freshPages(pageIds?: string[]): Promise<Page[]>;
}
