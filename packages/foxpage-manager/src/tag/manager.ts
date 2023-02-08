import _ from 'lodash';

import { tag } from '@foxpage/foxpage-shared';
import { Application, Content, ResourceUpdateInfo, Tag, TagManager, TagMatchOption } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

/**
 * tag manager
 *
 * @export
 * @class TagManagerImpl
 */
export class TagManagerImpl extends ManagerBaseImpl<Content> implements TagManager {
  /**
   * fileId & pageIds map
   * key: fileId, value: pageIds
   *
   * @private
   */
  private pageIdMap = new Map<string, string[]>();

  constructor(app: Application) {
    super(app, { type: 'tag', diskCache: { enable: true } });
  }

  /**
   * add tag
   *
   * @param {ContentTag} content
   */
  public addTag(content: Content) {
    this.logger.info(`add tag content:`, JSON.stringify(content));

    const { id: pageId, fileId } = content || {};
    this.addOne(pageId, content, content);

    let pageIds = this.pageIdMap.get(fileId);
    if (!pageIds) {
      pageIds = [pageId];
    } else {
      const exist = pageIds.indexOf(pageId) > -1;
      if (!exist) {
        pageIds.push(pageId);
      }
    }
    this.pageIdMap.set(fileId, pageIds);
  }

  /**
   * remove tags by pageIds
   *
   * @param {string[]} pageIds
   */
  public removeTags(pageIds: string[] = []) {
    // remove source
    this.remove(pageIds);

    this.pageIdMap.forEach((value, key) => {
      const result = _.remove(value, item => pageIds.indexOf(item) > -1);
      this.pageIdMap.set(key, result);
    });
  }

  /**
   * get tag, contains content info
   *
   * @param {Tag[]} tags
   * @param {TagMatchOption} opt
   * @return {*}  {(Promise<Content | null>)}
   */
  public async matchTag(tags: Tag[], opt: TagMatchOption): Promise<Content | null> {
    const { pathname = '', fileId = '' } = opt;

    if (fileId) {
      const pageIds = this.pageIdMap.get(fileId);
      let contentTags: Content[] = [];
      let content: Content | null = null;
      if (pageIds && pageIds.length > 0) {
        // only find from local
        contentTags = await this.find(pageIds, { autoFetch: false });
      }
      if (contentTags.length > 0) {
        content = tag.matchContent(contentTags, tags);
      }
      if (content) {
        return content;
      }
    }

    this.logger.info(
      `local not exist the fileId "${fileId}" with tags: ${JSON.stringify(tags)} content, will fetch from server.`,
    );

    let result: Content | null = null;
    if (opt.withContentInfo) {
      result = await this.freshWithTags(fileId, pathname, tags);
    } else {
      result = await foxpageDataService.fetchContentByTags(this.appId, fileId, pathname, tags);
    }
    if (!result) {
      this.logger.warn(`not match the pathname "${pathname}", tags:`, tags);
      return null;
    }
    return result;
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    // updates & removes is content ids
    const { updates, removes } = data.tag || {};
    if (updates?.length) {
      const contentIds = await this.filterExists(updates);

      if (contentIds.length > 0) {
        this.markNeedUpdates(contentIds);
        const contents = await foxpageDataService.fetchAppContents(this.appId, { contentIds });
        contents.forEach(content => {
          this.addOne(content.id, content, content);
        });
      }
    }
    if (removes?.length) {
      this.removeTags(removes);
    }
  }

  protected async createInstance(data: Content) {
    return data;
  }

  protected async onFetch(_list: string[]): Promise<undefined> {
    return undefined;
  }

  private async freshWithTags(fileId: string, pathname: string, tags: Tag[] = []): Promise<Content | null> {
    const result = await foxpageDataService.fetchAppContentByTags(this.appId, fileId, pathname, tags);
    if (result && result.content) {
      this.logger.info('fetched content info with tags:', JSON.stringify(tags));

      if (result.contentInfo) {
        // emit event: cache user request data
        this.emit('DATA_PUSH', result.contentInfo);
      }

      this.addTag(result.content);
      return result.content;
    }

    return null;
  }

  public destroy() {
    super.destroy();
    this.pageIdMap.clear();
  }
}
