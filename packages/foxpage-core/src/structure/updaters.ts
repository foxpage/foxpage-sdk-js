import { Context, FoxpageComponent, StructureNode } from '@foxpage/foxpage-types';

export function appendStructure(
  parent: StructureNode,
  structure: StructureNode,
  component: FoxpageComponent,
  ctx: Context,
) {
  parent.children = parent.children || [];
  parent.children.push(structure);

  ctx.componentMap?.set(structure.id, component);

  return parent;
}
