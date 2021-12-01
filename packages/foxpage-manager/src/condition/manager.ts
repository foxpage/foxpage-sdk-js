import { Application, Condition, ConditionManager, ContentInfo, ResourceUpdateInfo } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { ConditionInstance } from './condition';

/**
 * condition manager
 *
 * @export
 * @class ConditionManager impl
 * @extends {ManagerBaseImpl}
 */
export class ConditionManagerImpl extends ManagerBaseImpl<Condition> implements ConditionManager {
  constructor(app: Application) {
    super(app, { type: 'condition', diskCache: { enable: true } });
  }

  /**
   * add condition to manager
   *
   * @param {Condition} condition
   */
  public addCondition(condition: Condition) {
    this.logger.debug(`add condition@${condition.id}, detail:`, JSON.stringify(condition));

    const instance = this.newCondition(condition);
    this.addOne(condition.id, condition, instance);
    return instance;
  }

  /**
   * remove application conditions
   *
   * @param {string[]} conditionIds
   */
  public removeConditions(conditionIds: string[]) {
    this.remove(conditionIds);
  }

  /**
   * get condition via conditionId from  local
   *
   * @param {string} conditionId
   * @return {*}  {Promise<Condition|undefined>}
   */
  public async getCondition(conditionId: string): Promise<Condition | undefined> {
    return (await this.find([conditionId]))[0];
  }

  /**
   * get conditions
   *
   * @param {string[]} conditionIds
   * @return {*}  {Promise<Condition[]>}
   */
  public async getConditions(conditionIds: string[]): Promise<Condition[]> {
    return await this.find(conditionIds);
  }

  /**
   * fetch application conditions
   *
   * @param {string[]} conditionIds
   * @return {*}  {Promise<Condition[]>}
   */
  public async freshConditions(conditionIds: string[]): Promise<Condition[]> {
    const conditions = await foxpageDataService.fetchAppConditions(this.appId, { conditionIds });
    return conditions.map(item => {
      return this.addCondition(item);
    });
  }

  protected async onFetch(list: string[]) {
    return await this.freshConditions(list);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.condition || {};
    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      this.markNeedUpdates(contentIds);
      await this.freshConditions(contentIds);
    }
    if (removes && removes.length > 0) {
      this.removeConditions(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.conditions?.map(item => {
      this.addCondition(item);
    });
  }

  protected async createInstance(data: Condition) {
    return this.newCondition(data);
  }

  private newCondition(data: Condition) {
    return new ConditionInstance(data);
  }
}
