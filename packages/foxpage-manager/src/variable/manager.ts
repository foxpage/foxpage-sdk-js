import { Application, ContentInfo, ResourceUpdateInfo, Variable, VariableManager } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { VariableInstance } from './variable';

/**
 * variable manager
 *
 * @export
 * @class VariableManager
 * @extends {ManagerBaseImpl}
 */
export class VariableManagerImpl extends ManagerBaseImpl<Variable> implements VariableManager {
  constructor(app: Application) {
    super(app, { type: 'variable', diskCache: { enable: true } });
  }

  /**
   * add variable to manager
   *
   * @param {Variable} variable
   */
  public addVariable(variable: Variable) {
    this.logger.info(`add variable@${variable.id}, detail:`, JSON.stringify(variable));
    const newVar = this.newVariable(variable);
    this.addOne(variable.id, variable, newVar);
    return newVar;
  }

  /**
   * remove local variable via variableId
   *
   * @param {string[]} variableIds
   */
  public removeVariables(variableIds: string[]) {
    this.remove(variableIds);
  }

  /**
   * get variable from local first, not exist will fetch from server
   *
   * @param {string} variableId
   * @return {*}  {(Promise<Variable | undefined>)}
   */
  public async getVariable(variableId: string): Promise<Variable | undefined> {
    return (await this.getVariables([variableId]))[0];
  }

  /**
   * get variables
   *
   * @param {string[]} variableIds
   * @return {*}  {Promise<Variable[]>}
   */
  public async getVariables(variableIds: string[]): Promise<Variable[]> {
    return await this.find(variableIds);
  }

  /**
   * fetch application variable
   */
  public async freshVariables(variableIds: string[]): Promise<Variable[]> {
    const variables = await foxpageDataService.fetchAppVariables(this.appId, { variableIds });
    return variables.map(variable => {
      return this.addVariable(variable);
    });
  }

  protected async onFetch(list: string[]) {
    return await this.freshVariables(list);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.variable || {};
    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      if (contentIds.length > 0) {
        this.markNeedUpdates(contentIds);
        await this.freshVariables(contentIds);
      }
    }
    if (removes && removes.length > 0) {
      this.removeVariables(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.variables?.map(variable => {
      this.addVariable(variable);
    });
  }

  protected async createInstance(data: Variable) {
    return this.newVariable(data);
  }

  private newVariable(data: Variable) {
    return new VariableInstance(data);
  }
}
