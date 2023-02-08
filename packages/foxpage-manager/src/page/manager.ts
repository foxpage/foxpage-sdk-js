import { chunk } from 'lodash';

import {
  Application,
  ContentInfo,
  ContentRelationInfo,
  Page,
  PageManager,
  ResourceUpdateInfo,
} from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { PageInstance } from './page';

const CHUNK_SIZE = 5;

/**
 * page manager
 *
 * @export
 * @class PageManager
 */
export class PageManagerImpl extends ManagerBaseImpl<Page> implements PageManager {
  constructor(app: Application) {
    super(app, { type: 'page', diskCache: { enable: true } });
  }

  /**
   * add page to manager
   *
   * @param {Page} page
   */
  public addPage(page: Page) {
    this.logger.info(`add page@${page.id}, detail:`, JSON.stringify(page));

    const newPage = this.newPage(page);
    this.addOne(page.id, page, newPage);
    return newPage;
  }

  /**
   * remove page from manger
   *
   * @param {string[]} pageIds
   */
  public removePages(pageIds: string[]) {
    this.remove(pageIds);
  }

  /**
   * get page from local first
   * no exist will fetch from  server
   *
   * @param {string} pageId
   * @return {*}  {(Page | undefined)}
   */
  public async getPage(pageId: string): Promise<Page | undefined> {
    return (await this.getPages([pageId]))[0];
  }

  /**
   * get pages
   *
   * @param {string[]} pageIds
   * @return {*}  {Promise<Page[]>}
   */
  public async getPages(pageIds: string[]): Promise<Page[]> {
    return await this.find(pageIds);
  }

  /**
   * fetch draft pages
   *
   * @param {string[]} pageIds
   * @return {*}  {Promise<ContentRelationInfo[]>}
   */
  public async getDraftPages(pageIds: string[]): Promise<ContentRelationInfo[]> {
    return await foxpageDataService.fetchDraftContentRelationInfos(this.appId, { contentIds: pageIds });
  }

  /**
   * fetch pages from server
   *
   * @return {*}  {Promise<Page[]>}
   */
  public async freshPages(pageIds: string[] = []): Promise<Page[]> {
    const chunks = chunk(pageIds, CHUNK_SIZE);
    let pages: Page[] = [];
    const fetcher = async (list: string[][]) => {
      for (const _pageIds of list) {
        const result = await foxpageDataService.fetchAppPages(this.appId, { pageIds: _pageIds });
        pages = pages.concat(result);
      }
    };
    await fetcher(chunks);
    // add & update
    return pages.map(page => {
      return this.addPage(page);
    });
  }

  /**
   * first request page will return the all relations
   *
   * @protected
   * @param {string[]} pageIds
   */
  protected async onFetch(pageIds: string[]) {
    // return await this.freshPages(list);
    const results = await foxpageDataService.fetchContentRelationInfos(this.appId, { contentIds: pageIds });
    this.logger.info('fetched content infos:', JSON.stringify(results));

    return results.map(item => {
      // emit event: cache user request data
      this.emit('DATA_PUSH', item.relations);
      return this.addPage(item.content as Page);
    });
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    this.logger.info('get pull, detail:', data);
    const { updates, removes } = data.page || {};

    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      if (contentIds.length > 0) {
        this.markNeedUpdates(contentIds);
        await this.freshPages(contentIds);
      }
    }
    if (removes && removes.length > 0) {
      this.removePages(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.pages?.map(item => {
      this.addPage(item);
    });
  }

  protected async createInstance(data: Page) {
    return this.newPage(data);
  }

  private newPage(data: Page) {
    return new PageInstance(data);
  }
}
