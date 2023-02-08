import { DSLStructure } from '../../../src';
import {
  matchAllStructureById,
  matchAllStructureByType,
  matchStructureById,
  matchStructureByType,
  MergeStrategy,
  StructureMerger,
} from '../../../src/merger';

import { createDSLStructure } from './helper/generateStructure';

describe('merger/structure-matcher', () => {
  let DSLStructures: DSLStructure[] = [];
  let preList: StructureMerger[] = [];
  const options = {
    mergeStrategy: MergeStrategy.replace,
  };

  beforeEach(() => {
    DSLStructures = [
      createDSLStructure('foxpage.test1', {}, { version: '1' }),
      createDSLStructure('foxpage.test2', {}, { version: '2' }),
      createDSLStructure('foxpage.test2', {}, { version: '2', props: { test: 'foxpage-test2' } }),
    ];
    preList = [];
    DSLStructures.forEach(item => {
      preList.push(new StructureMerger(item, options));
    });
  });

  it('match structure by id', () => {
    const structureNode = DSLStructures[0];
    const result = matchStructureById(preList, structureNode.id);
    expect(result).toBe(preList[0]);
  });

  it('match all structure by id', () => {
    preList.push(new StructureMerger(createDSLStructure('foxpage.test2', {}, { id: 'A', version: '2' }), options));
    preList.push(new StructureMerger(createDSLStructure('foxpage.test2', {}, { id: 'A', version: '2' }), options));
    const result = matchAllStructureById(preList, 'A');
    expect(result.length).toBe(2);
    expect(result[0]).toBe(preList[3]);
    expect(result[1]).toBe(preList[4]);
  });

  it('match structure by type', () => {
    const result = matchStructureByType(preList, 'foxpage.test2');
    expect(result).toBe(preList[1]);
  });

  it('match all structure by type', () => {
    const result = matchAllStructureByType(preList, 'foxpage.test2');
    expect(result?.length).toBe(2);
    expect(result).not.toBe(preList[0]);
    expect(result[0]).toBe(preList[1]);
    expect(result[1]).toBe(preList[2]);
  });
});
