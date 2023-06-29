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

  /**
   * block containers
   *
   * @type {Map<string, StructureNode>}
   */
  blockSchemasMap: Map<string, StructureNode> = new Map<string, StructureNode>();

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
    this.getTplRefers(this.page.schemas, ctx);
  }

  /**
   * do parse
   *
   * @param {Context} ctx
   */
  public parse(ctx: Context) {
    const { id, schemas, relation } = this.page;

    const parser = this.pageParser(ctx);
    const { parsed, messages } = parser(schemas);
    ctx.logger?.info(`page@${id} parsed`);
    const result = {
      type: 'page',
      id,
      schemas: parsed,
      relation,
    } as Page;
    return { parsed: result, messages };
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

  /**
   * get block container by blockId
   *
   * @param {string} blockId
   * @return {StructureNode|undefined}
   */
  public getBlockSchemas(blockId: string): StructureNode | undefined {
    return this.blockSchemasMap.get(blockId);
  }

  private pageParser(ctx: Context) {
    const messages = new Messages();
    const parseFn = (list: StructureNode[]) => {
      let parseList = [] as StructureNode[];
      list.forEach(item => {
        const { props, directive, children } = item;
        const { tpl = '' } = directive || {};
        const directiveInstance = directive ? new DirectiveParser(directive) : null;
        // default will show
        item.show = true;
        if (directiveInstance?.hasIf()) {
          item.show = !!directiveInstance.parseIf(ctx, messages);
        }

        // if contains tpl directive, will use template content cover this node
        if (directiveInstance?.hasTpl()) {
          // replace page node from matched tpl schemas
          const tplSchemas = directiveInstance.parseTpl(ctx, messages) as StructureNode[] | undefined;
          if (tplSchemas) {
            const tplParsedSchemas = parseFn(_.cloneDeep(tplSchemas)).parsed;
            if (this.isTemplateTpl(tpl)) {
              parseList = parseList.concat(tplParsedSchemas);
            } else {
              const blockRoot = tplParsedSchemas[0];
              if (blockRoot) {
                const { props, children = [] } = blockRoot;
                parseList.push(Object.assign({}, item, { props, children: children }));
              }
            }
          } else {
            const msg = `${tpl} not matched tpl`;
            messages.push(new Error(msg));
            ctx.logger?.warn(msg);
            parseList.push(item);
          }
        } else {
          // props parse
          if (props) {
            const resolvedProps = executeObject(props, ctx.variables, messages) as StructureNode['props'];
            item.props = resolvedProps;
          }

          if (children && children.length > 0) {
            const { parsed: childrenParsed } = parseFn(children);
            parseList.push(Object.assign({}, item, { children: childrenParsed }));
          } else {
            parseList.push(item);
          }
        }
      });
      return { parsed: parseList, messages: messages.formate() };
    };
    return parseFn;
  }

  private getTplRefers(structures: StructureNode[] = [], ctx: Context) {
    structures.forEach(item => {
      const tplVar = item.directive?.tpl;

      if (tplVar && typeof tplVar === 'string') {
        if (tplVar.startsWith('{{') && tplVar.indexOf('}}') === tplVar.length - 2) {
          const expression = tplVar.substring(2, tplVar.length - 2);
          ctx.logger?.info(`${expression} to match tpl id`);
          const id = this.page.relation ? this.page.relation[expression]?.id : '';
          if (id) {
            if (this.isTemplateTpl(expression)) {
              this.templateSchemasMap.set(id, item);
            } else {
              this.blockSchemasMap.set(id, item);
            }
            ctx.logger?.info(`${expression} matched tpl id@${id} succeed`);
          } else {
            ctx.logger?.warn(`${expression} matched tpl id@${id} failed: empty`);
          }
        }
      }

      if (item.children && item.children.length > 0) {
        this.getTplRefers(item.children, ctx);
      }
    });
  }

  private isTemplateTpl(str: string) {
    // template: __templates, block: __blocks
    return str.indexOf('__templates') > -1;
  }
}
