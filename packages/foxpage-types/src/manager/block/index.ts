import { ContentDetail } from '../../content';
import { ContentRelationInfo } from '../../content';
import { StructureNode } from '../../structure';
import { ManagerBase } from '..';

export interface Block extends ContentDetail<StructureNode> {}

export interface BlockManager<T = Block> extends ManagerBase<T> {
  addBlock(page: Block): void;
  removeBlocks(pageIds: string[]): void;
  getBlock(pageId: string): Promise<Block | undefined>;
  getBlocks(pageIds: string[]): Promise<Block[]>;
  getDraftBlocks(pageIds: string[]): Promise<ContentRelationInfo[]>;
  freshBlocks(pageIds?: string[]): Promise<Block[]>;
}
