import { Context, FoxpageComponent, StructureNode } from '@foxpage/foxpage-types';

import { appendStructure } from '@/structure/updaters';

describe('structure/updaters', () => {
  it('appendStructure test', () => {
    const parent = { children: [] } as unknown as StructureNode;
    const structure = { id: '111', name: 'test', props: {} } as unknown as StructureNode;
    const component = { name: structure.name } as unknown as FoxpageComponent;
    const ctx = {
      componentMap: new Map(),
    } as unknown as Context;

    const result = appendStructure(parent, structure, component, ctx);

    expect(result.children.length).toBe(1);
    expect(result.children[0]).toEqual(structure);
    expect(ctx.componentMap.size).toBe(1);

    const ctxComponent = ctx.componentMap.get(structure.id);
    expect(ctxComponent).toBeDefined();
    expect(ctxComponent.name).toBe(structure.name);
  });
});
