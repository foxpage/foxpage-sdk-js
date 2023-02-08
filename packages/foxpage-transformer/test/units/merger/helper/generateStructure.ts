import shortid from 'shortid';

import { DSLStructure } from '../../../../src';

export const DYNAMIC_MOUNT_NODE = 'system.dynamic-mount-node';

export function createDSLStructure(type: string, props: Record<string, any> = {}, partial: Partial<DSLStructure> = {}) {
  const structure: DSLStructure = {
    id: `create_${type}_${shortid()}`,
    props,
    type,
    version: '',
    ...partial,
  };
  return structure;
}

export const generateStructures = () => {
  const staticStructures = [];
  staticStructures.push(
    createDSLStructure(
      'A',
      { test: 'A' },
      {
        id: 'A',
        version: '1',
        children: [
          createDSLStructure(
            'B',
            { test: 'A-B' },
            {
              id: 'B',
              version: '1',
              children: [
                createDSLStructure(
                  'C',
                  { test: 'A-B-C' },
                  {
                    id: 'C1',
                    version: '1',
                  },
                ),
              ],
            },
          ),
          createDSLStructure(
            'C',
            { test: 'A-C' },
            {
              id: 'C2',
              version: '1',
            },
          ),
          createDSLStructure(DYNAMIC_MOUNT_NODE, { test: 'A-M' }, { id: 'M', version: '1' }),
        ],
      },
    ),
  );
  return staticStructures;
};

export const generateDynamicStructures = () => {
  const dynamicStructures = [];
  dynamicStructures.push(
    createDSLStructure(
      'A',
      { test1: 'A-1' },
      { id: 'A', version: '', children: [createDSLStructure('B', { test1: 'A-B-1' }, { id: 'B', version: '' })] },
    ),
  );
  dynamicStructures.push(createDSLStructure('B', { test2: 'B-1' }, { id: 'B', version: '' }));
  dynamicStructures.push(createDSLStructure('C', { test1: 'C-1' }, { id: '', version: '' }));
  dynamicStructures.push(createDSLStructure('C', { test2: 'C-2' }, { id: '', version: '' }));
  dynamicStructures.push(
    createDSLStructure(
      DYNAMIC_MOUNT_NODE,
      { test: 'M-1' },
      {
        id: 'M',
        version: '1',
        children: [
          createDSLStructure(
            'D',
            { test: 'M-D' },
            {
              id: '',
              version: '1',
            },
          ),
        ],
      },
    ),
  );
  return dynamicStructures;
};
