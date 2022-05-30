import { Application, ContentInfo, Mock, MockManager, ResourceUpdateInfo } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { MockInstance } from './mock';

/**
 * mock manager
 *
 * @export
 * @class MockManager
 * @extends {ManagerBaseImpl}
 */
export class MockManagerImpl extends ManagerBaseImpl<Mock> implements MockManager {
  constructor(app: Application) {
    super(app, { type: 'mock', diskCache: { enable: true } });
  }

  /**
   * add mock to manager
   *
   * @param {Mock} mock
   */
  public addMock(mock: Mock) {
    this.logger.debug(`add mock@${mock.id}, detail:`, JSON.stringify(mock));

    const newVar = this.newMock(mock);
    this.addOne(mock.id, mock, newVar);
    return newVar;
  }

  /**
   * remove local mock via mockId
   *
   * @param {string[]} mockIds
   */
  public removeMocks(mockIds: string[]) {
    this.remove(mockIds);
  }

  /**
   * get mock from local first, not exist will fetch from server
   *
   * @param {string} mockId
   * @return {*}  {(Promise<Mock | undefined>)}
   */
  public async getMock(mockId: string): Promise<Mock | undefined> {
    return (await this.getMocks([mockId]))[0];
  }

  /**
   * get mocks
   *
   * @param {string[]} mockIds
   * @return {*}  {Promise<Mock[]>}
   */
  public async getMocks(mockIds: string[]): Promise<Mock[]> {
    return await this.find(mockIds);
  }

  /**
   * fetch application mock
   */
  public async freshMocks(mockIds: string[]): Promise<Mock[]> {
    const mocks = await foxpageDataService.fetchAppMocks(this.appId, { mockIds });
    return mocks.map(mock => {
      return this.addMock(mock);
    });
  }

  protected async onFetch(list: string[]) {
    return await this.freshMocks(list);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.mock || {};
    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      this.markNeedUpdates(contentIds);
      await this.freshMocks(contentIds);
    }
    if (removes && removes.length > 0) {
      this.removeMocks(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.mocks?.map(mock => {
      this.addMock(mock);
    });
  }

  protected async createInstance(data: Mock) {
    return this.newMock(data);
  }

  private newMock(data: Mock) {
    return new MockInstance(data);
  }
}
