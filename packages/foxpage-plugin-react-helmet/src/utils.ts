import { structure as structureUtils } from '@foxpage/foxpage-core';
import { Context, FoxpageComponentMeta, StructureNode } from '@foxpage/foxpage-types';

/**
 * find structure by meta info
 *
 * @export
 * @param {Context} ctx
 * @param {('isHead' | 'isBody')} tag
 * @return {*}
 */
export function findStructure(dsl: StructureNode[], ctx: Context, tag: keyof FoxpageComponentMeta) {
  return structureUtils.findStructure(dsl || [], item => {
    if (item) {
      const component = ctx.componentMap?.get(item.id);
      if (component) {
        // useStyledComponents: the meta of package provide
        return !!component.meta[tag];
      }
    }
    return false;
  });
}
