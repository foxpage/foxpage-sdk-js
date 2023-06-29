import { chunk } from 'lodash';

import {
  Application,
  Block,
  BlockManager,
  ContentInfo,
  ContentRelationInfo,
  ResourceUpdateInfo,
} from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { BlockInstance } from './block';

const CHUNK_SIZE = 5;

/**
 * block manager
 *
 * @export
 * @class BlockManager
 */
export class BlockManagerImpl extends ManagerBaseImpl<Block> implements BlockManager {
  constructor(app: Application) {
    super(app, { type: 'block', diskCache: { enable: true } });
  }

  /**
   * add block to manager
   *
   * @param {Block} block
   */
  public addBlock(block: Block) {
    this.logger.info(`add block@${block.id}, detail:`, JSON.stringify(block));

    const newBlock = this.newBlock(block);
    this.addOne(block.id, block, newBlock);
    return newBlock;
  }

  /**
   * remove block from manger
   *
   * @param {string[]} blockIds
   */
  public removeBlocks(blockIds: string[]) {
    this.remove(blockIds);
  }

  /**
   * get block from local first
   * no exist will fetch from  server
   *
   * @param {string} blockId
   * @return {*}  {(Block | undefined)}
   */
  public async getBlock(blockId: string): Promise<Block | undefined> {
    return (await this.getBlocks([blockId]))[0];
  }

  /**
   * get blocks
   *
   * @param {string[]} blockIds
   * @return {*}  {Promise<Block[]>}
   */
  public async getBlocks(blockIds: string[]): Promise<Block[]> {
    return await this.find(blockIds);
  }

  /**
   * fetch draft blocks
   *
   * @param {string[]} blockIds
   * @return {*}  {Promise<ContentRelationInfo[]>}
   */
  public async getDraftBlocks(blockIds: string[]): Promise<ContentRelationInfo[]> {
    return await foxpageDataService.fetchDraftBlockRelationInfos(this.appId, { contentIds: blockIds });
  }

  /**
   * fetch blocks from server
   *
   * @return {*}  {Promise<Block[]>}
   */
  public async freshBlocks(blockIds: string[] = []): Promise<Block[]> {
    const chunks = chunk(blockIds, CHUNK_SIZE);
    let blocks: Block[] = [];
    const fetcher = async (list: string[][]) => {
      for (const _blockIds of list) {
        const result = await foxpageDataService.fetchAppBlocks(this.appId, { blockIds: _blockIds });
        blocks = blocks.concat(result);
      }
    };
    await fetcher(chunks);
    // add & update
    return blocks.map(block => {
      return this.addBlock(block);
    });
  }

  /**
   * first request block will return the all relations
   *
   * @protected
   * @param {string[]} blockIds
   */
  protected async onFetch(blockIds: string[]) {
    const results = await foxpageDataService.fetchBlockRelationInfos(this.appId, { contentIds: blockIds });
    this.logger.info('fetched content infos:', JSON.stringify(results));

    return results.map(item => {
      // emit event: cache user request data
      this.emit('DATA_PUSH', item.relations);
      return this.addBlock(item.content as Block);
    });
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    this.logger.info('get pull, detail:', data);
    const { updates, removes } = data.block || {};

    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      if (contentIds.length > 0) {
        this.markNeedUpdates(contentIds);
        await this.freshBlocks(contentIds);
      }
    }
    if (removes && removes.length > 0) {
      this.removeBlocks(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.blocks?.map(item => {
      this.addBlock(item);
    });
  }

  protected async createInstance(data: Block) {
    return this.newBlock(data);
  }

  private newBlock(data: Block) {
    return new BlockInstance(data);
  }
}
