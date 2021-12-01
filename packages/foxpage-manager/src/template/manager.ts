import { Application, ContentInfo, ResourceUpdateInfo, Template, TemplateManager } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { TemplateInstance } from './template';

/**
 * template manager
 *
 * @export
 * @class TemplateManager
 */
export class TemplateManagerImpl extends ManagerBaseImpl<Template> implements TemplateManager {
  constructor(app: Application) {
    super(app, { type: 'template', diskCache: { enable: true } });
  }

  /**
   * add template to manager
   *
   * @param {Template} template
   */
  public addTemplate(template: Template) {
    this.logger.debug(`add template@${template.id}, detail:`, JSON.stringify(template));

    const newTpl = this.newTemplate(template);
    this.addOne(template.id, template, newTpl);
    return newTpl;
  }

  /**
   * get template
   * if not exist local, will fetch from server then cache to local
   * @param {string} templateId
   */
  public async getTemplate(templateId: string): Promise<Template | undefined> {
    return (await this.getTemplates([templateId]))[0];
  }

  /**
   * get templates batch
   *
   * @param {string[]} templateIds
   * @return {*}  {Promise<Template[]>}
   */
  public async getTemplates(templateIds: string[]): Promise<Template[]> {
    return await this.find(templateIds);
  }

  /**
   * remove template
   *
   * @param {string[]} templateIds
   */
  public removeTemplates(templateIds: string[]) {
    this.remove(templateIds);
  }

  /**
   * fetch templates from server
   *
   * @return {*} Promise<Template[]>
   */
  public async freshTemplates(templateIds?: string[]): Promise<Template[]> {
    const templates = await foxpageDataService.fetchAppTemplates(this.appId, { templateIds });
    return templates.map(template => {
      return this.addTemplate(template);
    });
  }

  protected async onFetch(templateIds?: string[]): Promise<Template[]> {
    return this.freshTemplates(templateIds);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.template || {};
    if (updates && updates.length > 0) {
      const contentIds = await this.filterExists(updates);

      this.markNeedUpdates(contentIds);
      await this.freshTemplates(contentIds);
    }
    if (removes && removes.length > 0) {
      this.removeTemplates(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.templates?.map(template => {
      this.addTemplate(template);
    });
  }

  protected async createInstance(data: Template) {
    return this.newTemplate(data);
  }

  private newTemplate(data: Template) {
    return new TemplateInstance(data);
  }
}
