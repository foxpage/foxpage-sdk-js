import {
  Application,
  ContentInfo,
  FPFunction,
  FPFunctionItem,
  FunctionManager,
  ResourceUpdateInfo,
} from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { FPFunctionInstance } from './function';

/**
 * function manager
 *
 * @export
 * @class FunctionManager
 * @extends {ManagerBaseImpl}
 */
export class FunctionManagerImpl extends ManagerBaseImpl<FPFunction> implements FunctionManager {
  constructor(app: Application) {
    super(app, { type: 'function', diskCache: { enable: true } });
  }

  /**
   * add function content to manager
   *
   * @param {FPFunction} content
   */
  public addFunction(content: FPFunction) {
    this.logger.info(`add function@${content.id}, detail:`, JSON.stringify(content));

    const newFunc = this.newFunction(content);
    this.addOne(content.id, content, newFunc);
    return newFunc;
  }

  /**
   * get function
   *
   * @param {string} functionId
   * @return {*}  {(Promise<FPFunction | undefined>)}
   */
  public async getFunction(functionId: string): Promise<FPFunction | null> {
    return (await this.getFunctions([functionId]))[0];
  }

  /**
   * get function item
   *
   * @param {string} functionId
   * @param {string} functionItemName
   * @return {*}  {(Promise<FPFunctionItem | undefined)}
   */
  public async getFunctionItem(functionId: string, functionItemName: string): Promise<FPFunctionItem | null> {
    const result = await this.getFunction(functionId);
    if (!result) {
      this.logger.warn(`not exist this function@${functionId}`);
      return null;
    }

    return result.getFunctionItem ? result.getFunctionItem(functionItemName) : null;
  }

  /**
   * get functions
   *
   * @param {string[]} functionIds
   * @return {*}  {Promise<FPFunction[]>}
   */
  public async getFunctions(functionIds: string[]): Promise<FPFunction[]> {
    return await this.find(functionIds);
  }

  /**
   * fetch application functions
   */
  public async freshFunctions(functionIds: string[]): Promise<FPFunction[]> {
    const functions = await foxpageDataService.fetchAppFunctions(this.appId, { functionIds });
    return functions.map(item => {
      return this.addFunction(item);
    });
  }

  /**
   * remove functions via functionIds
   *
   * @param {string[]} functionIds
   */
  public removeFunctions(functionIds: string[]) {
    this.remove(functionIds);
  }

  protected async onFetch(list: string[]) {
    return await this.freshFunctions(list);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.function || {};
    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      if (contentIds.length > 0) {
        this.markNeedUpdates(contentIds);
        await this.freshFunctions(contentIds);
      }
    }
    if (removes && removes.length > 0) {
      this.removeFunctions(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.functions?.map(item => {
      this.addFunction(item);
    });
  }

  protected async createInstance(data: FPFunction) {
    return this.newFunction(data);
  }

  private newFunction(data: FPFunction) {
    return new FPFunctionInstance(data);
  }
}
