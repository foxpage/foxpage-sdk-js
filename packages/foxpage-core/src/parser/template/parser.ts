import _ from 'lodash';

import { ContentType } from '@foxpage/foxpage-shared';
import { Context, StructureNode, Template, TemplateParser } from '@foxpage/foxpage-types';

import { executeObject, executeString } from '../sandbox';

/**
 * template parser impl
 *
 * @export
 * @class TemplateParserImpl
 * @implements {TemplateParser}
 */
export class TemplateParserImpl implements TemplateParser {
  templates: Template[] = [];

  /**
   * tpl container map， for generate scope
   *
   * @type {Map<string, StructureNode>}
   */
  containerMap: Map<string, StructureNode> = new Map();

  /**
   * prepare, set page root data
   *
   * @param {Context} ctx
   * @param {{ containerGetter?: (id: string) => StructureNode }} [opt]
   */
  public preParse(ctx: Context, opt?: { containerGetter?: (id: string) => StructureNode }) {
    this.templates = _.cloneDeep(ctx.origin.templates) || [];

    this.templates.forEach(template => {
      const tplContainer = opt?.containerGetter ? opt.containerGetter(template.id) : null;
      if (tplContainer) {
        ctx.logger?.debug('template parse, template:', JSON.stringify(template));
        ctx.logger?.debug('tpl node:', JSON.stringify(tplContainer));

        this.containerMap.set(template.id, tplContainer);
      }
    });
  }

  /**
   * parse all template in render context
   *
   * @param {Context} ctx
   */
  public parse(ctx: Context) {
    this.templates.forEach(tpl => {
      const parser = this.tplParser(tpl, ctx);
      const { parsed, messages } = parser(tpl.schemas);
      ctx.logger?.info(`template@${tpl.id} parsed`);
      ctx.logger?.debug(`template@${tpl.id} parsed:`, JSON.stringify(parsed));

      ctx.updateResource(ContentType.TEMPLATE, tpl.id, {
        content: tpl,
        parsed: { id: tpl.id, schemas: parsed, relation: tpl.relation },
        parseStatus: true,
        parseMessages: messages,
      });
    });
  }

  private tplParser(tpl: Template, ctx: Context) {
    const scope = this.containerMap.get(tpl.id);
    const messages: string[] = [];

    const parseFn = (list: StructureNode[] = []) => {
      let parseList: StructureNode[] = [];
      list.forEach(item => {
        const { props, directive, children } = item;

        // props parse
        if (props) {
          const resolvedProps = executeObject(
            props,
            { $this: scope, ...ctx.variables },
            messages,
          ) as StructureNode['props'];
          item.props = resolvedProps;
        }

        // directive parse
        if (directive && directive.tpl) {
          const tpl = executeString(directive.tpl, { $this: scope, ...ctx.variables }, messages) as StructureNode[];
          // directive.tpl = undefined;
          // item.children = tpl;
          if (tpl) {
            parseList = parseList.concat(tpl);
          } else {
            const msg = `directive.tpl "${directive.tpl}" parse failed.`;
            messages.push(msg);
          }
        } else {
          if (children && children.length > 0) {
            const { parsed: childrenParsed } = parseFn(children);
            parseList.push(Object.assign({}, item, { children: childrenParsed }));
          } else {
            parseList.push(item);
          }
        }
      });
      return { parsed: parseList, messages };
    };

    return parseFn;
  }
}
