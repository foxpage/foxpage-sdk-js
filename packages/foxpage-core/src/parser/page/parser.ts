import _ from 'lodash';

import { Messages } from '@foxpage/foxpage-shared';
import { Context, Page, PageParser, StructureNode } from '@foxpage/foxpage-types';

import { DirectiveParser } from '../directive';
import { executeObject } from '../sandbox';

/**
 * page parser impl
 *
 * @export
 * @class PageParserImpl
 * @implements {PageParser}
 */
export class PageParserImpl implements PageParser {
  page: Page;

  /**
   * template containers
   *
   * @type {Map<string, StructureNode>}
   */
  templateSchemasMap: Map<string, StructureNode> = new Map<string, StructureNode>();

  messages: Messages;

  constructor(page: Page) {
    this.page = _.cloneDeep(page);
    this.messages = new Messages();
  }

  /**
   * pre parse for prepare template containers eg.
   *
   */
  public preParse(ctx: Context) {
    // init this.templateSchemasMap
    this.getTplContainers(this.page.schemas, ctx);
  }

  /**
   * do parse
   *
   * @param {Context} ctx
   * @param {StructureNode[]} [list=this.page.schemas]
   * @return {StructureNode[]}  {StructureNode[]}
   */
  public parse(ctx: Context, list: StructureNode[] = this.page.schemas): StructureNode[] {
    let newList = [] as StructureNode[];
    list.forEach(item => {
      const { props, directive, children } = item;
      const directiveInstance = directive ? new DirectiveParser(directive) : null;
      // default will show
      item.show = true;
      if (directiveInstance?.hasIf()) {
        item.show = !!directiveInstance.parseIf(ctx, this.messages);
      }

      // if contains tpl directive, will use template content cover this node
      if (directiveInstance?.hasTpl()) {
        // replace page node from matched tpl schemas
        const tplSchemas = directiveInstance.parseTpl(ctx, this.messages) as StructureNode[] | undefined;
        if (tplSchemas) {
          newList = newList.concat(this.parse(ctx, _.cloneDeep(tplSchemas)));
        } else {
          const msg = `${directive?.tpl} not matched template`;
          this.messages.push(new Error(msg));
          newList.push(item);
        }
      } else {
        // props parse
        if (props) {
          const resolvedProps = executeObject(props, ctx.variables, this.messages) as StructureNode['props'];
          item.props = resolvedProps;
        }

        if (children && children.length > 0) {
          item.children = this.parse(ctx, children);
        }

        newList.push(item);
      }
    });
    return newList;
  }

  /**
   * get template container by templateId
   *
   * @param {string} templateId
   * @return {StructureNode|undefined}
   */
  public getTemplateSchemas(templateId: string): StructureNode | undefined {
    return this.templateSchemasMap.get(templateId);
  }

  private getTplContainers(structures: StructureNode[] = [], ctx: Context) {
    structures.forEach(item => {
      const tplVar = item.directive?.tpl;

      if (tplVar && typeof tplVar === 'string') {
        if (tplVar.startsWith('{{') && tplVar.indexOf('}}') === tplVar.length - 2) {
          const expression = tplVar.substring(2, tplVar.length - 2);
          ctx.logger?.info(`${expression} to match template id`);
          const templateId = this.page.relation ? this.page.relation[expression]?.id : '';

          if (templateId) {
            this.templateSchemasMap.set(templateId, item);
            ctx.logger?.info(`${expression} matched template id@${templateId} succeed`);
          }
        }
      }

      if (item.children && item.children.length > 0) {
        this.getTplContainers(item.children, ctx);
      }
    });
  }
}
