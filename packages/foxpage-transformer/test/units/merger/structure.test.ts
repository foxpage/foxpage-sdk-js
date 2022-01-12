import { DSLStructure } from '../../../src';
import { MergeStrategy, structureMerge } from '../../../src/merger';

import { DYNAMIC_MOUNT_NODE, generateDynamicStructures, generateStructures } from './helper/generateStructure';

describe('merger/structure', () => {
  let staticStructures: DSLStructure[] = [];
  let dynamicStructures: DSLStructure[] = [];
  beforeEach(() => {
    // static structure
    // ---A---B
    //    |   |___C
    //    |___C
    //    |___M
    staticStructures = generateStructures();

    // dynamic
    // update [A,B,C,C,M-D]
    dynamicStructures = generateDynamicStructures();
  });

  it('structure replace', () => {
    const _structureMerged = structureMerge(staticStructures, dynamicStructures, {
      mergeStrategy: MergeStrategy.replace,
      mountNode: DYNAMIC_MOUNT_NODE,
    });
    const str = JSON.stringify(_structureMerged);
    expect(str).not.toMatch('A-B-1');
    expect(str).not.toMatch('A-B-C');
    expect(str).not.toMatch('A-B');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-1');
    expect(str.split('C-1')?.length).toBe(2);
    expect(str).toMatch('C-2');
    expect(str.split('C-2')?.length).toBe(2);
    expect(str).toMatch('M-D');
    expect(str).toMatch('sdk_init');
  });

  it('structure replaceAll', () => {
    const _structureMerged = structureMerge(staticStructures, dynamicStructures, {
      mergeStrategy: MergeStrategy.replaceAll,
      mountNode: DYNAMIC_MOUNT_NODE,
    });
    const str = JSON.stringify(_structureMerged);
    expect(str).not.toMatch('A-B-1');
    expect(str).not.toMatch('A-B-C');
    expect(str).not.toMatch('A-B');
    expect(str).not.toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-2');
    expect(str.split('C-2')?.length).toBe(3);
    expect(str).toMatch('M-D');
  });

  it('structure combine', () => {
    const _structureMerged = structureMerge(staticStructures, dynamicStructures, {
      mergeStrategy: MergeStrategy.combine,
      mountNode: DYNAMIC_MOUNT_NODE,
    });
    const str = JSON.stringify(_structureMerged);
    expect(str).toMatch('A-B-1');
    expect(str).toMatch('A-B-C');
    expect(str).toMatch('A-B');
    expect(str).toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-1');
    expect(str.split('C-1')?.length).toBe(2);
    expect(str).toMatch('M-D');
  });

  it('structure combineAll', () => {
    const _structureMerged = structureMerge(staticStructures, dynamicStructures, {
      mergeStrategy: MergeStrategy.combineAll,
      mountNode: DYNAMIC_MOUNT_NODE,
    });
    const str = JSON.stringify(_structureMerged);
    expect(str).toMatch('A-B-1');
    expect(str).toMatch('A-B-C');
    expect(str).toMatch('A-B');
    expect(str).toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-1');
    expect(str.split('C-1')?.length).toBe(3);
    expect(str).toMatch('M-D');
  });
});
