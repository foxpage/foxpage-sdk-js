import { createStructureWithFactory } from '@/structure/creators';

describe('structure/creators', () => {
  it('createStructureWithFactory test', () => {
    const factory = 'div';
    const props = { value: 'test' };
    const partial = {};
    const result = createStructureWithFactory(factory, props, partial);
    expect(result).toBeDefined();
    expect(result.component).toBeDefined();
    expect(result.structure).toBeDefined();
    expect(result.component.name).toBe('tag.div');
    expect(result.structure.type).toBe('react.component');
    expect(result.structure.props).toEqual(props);
  });
});
