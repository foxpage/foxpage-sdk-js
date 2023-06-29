import _ from 'lodash';

import { ContentType, Messages } from '@foxpage/foxpage-shared';
import { Block, BlockParser, Context, StructureNode } from '@foxpage/foxpage-types';

import { DirectiveParser } from '../directive';
import { executeObject } from '../sandbox';

/**
 * block parser impl
 *
 * @export
 * @class BlockParserImpl
 * @implements {BlockParser}
 */
export class BlockParserImpl implements BlockParser {
  messages: Messages;
  blocks: Block[] = [];

  /**
   * tpl container map， for generate scope
   *
   * @type {Map<string, StructureNode>}
   */
  containerMap: Map<string, StructureNode> = new Map();

  constructor() {
    this.messages = new Messages();
  }

  /**
   * prepare, set page root data
   *
   * @param {Context} ctx
   * @param {{ containerGetter?: (id: string) => StructureNode }} [opt]
   */
  public preParse(ctx: Context, opt?: { containerGetter?: (id: string) => StructureNode }) {
    this.blocks = _.cloneDeep(ctx.getOrigin(ContentType.BLOCK)) || [];
    this.blocks.forEach(block => {
      const tplContainer = opt?.containerGetter ? opt.containerGetter(block.id) : null;
      if (tplContainer) {
        this.containerMap.set(block.id, tplContainer);
      }
    });
  }

  /**
   * do parse
   *
   * @param {Context} ctx
   */
  public parse(ctx: Context) {
    this.blocks.forEach(block => {
      this.parseOne(block, ctx, { updateResource: true });
    });
  }

  /**
   * parse one
   * @param ctx
   * @param block
   * @returns
   */
  public parseOne(block: Block, ctx: Context, opt?: { updateResource: boolean }) {
    const parser = this.blockParser(opt?.updateResource ? block : null, ctx);
    const { parsed, messages } = parser(block.schemas);
    ctx.logger?.info(`block@${block.id} parsed`);
    const result = {
      content: block,
      parseStatus: true,
      parsed: { id: block.id, schemas: parsed, relation: block.relation } as Block,
      messages,
    };
    if (opt?.updateResource) {
      ctx.updateResource(ContentType.BLOCK, block.id, result);
    }
    return result;
  }

  private blockParser(block: Block | null, ctx: Context) {
    const scope = block ? this.containerMap.get(block.id) : {};
    const messages = new Messages();

    const parseFn = (list: StructureNode[]) => {
      const parseList: StructureNode[] = [];
      list.forEach(item => {
        const { props, directive, children } = item;
        const directiveInstance = directive ? new DirectiveParser(directive) : null;
        // default will show
        item.show = true;
        if (directiveInstance?.hasIf()) {
          item.show = !!directiveInstance.parseIf(ctx, messages);
        }

        // props parse
        if (props) {
          const resolvedProps = executeObject(
            props,
            { $this: scope, ...ctx.variables },
            messages,
          ) as StructureNode['props'];
          item.props = resolvedProps;
        }

        if (children && children.length > 0) {
          const { parsed: childrenParsed } = parseFn(children);
          parseList.push(Object.assign({}, item, { children: childrenParsed }));
        } else {
          parseList.push(item);
        }
      });
      return { parsed: parseList, messages: messages.formate() };
    };
    return parseFn;
  }
}
