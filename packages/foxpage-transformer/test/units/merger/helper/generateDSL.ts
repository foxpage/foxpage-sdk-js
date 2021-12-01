import shortid from 'shortid';

import { PageDSL } from '../../../../src';

import { generateDynamicStructures, generateStructures } from './generateStructure';

function createEmptyDSL({ locale = 'en-us' } = {}) {
  const dsl: PageDSL = {
    id: shortid(),
    variables: [],
    structures: [],
    conditions: [],
    locale,
    versionNumber: 1,
    md5: '',
  };
  return dsl;
}

export const generateDSL = () => {
  const dsl = createEmptyDSL();
  dsl.structures = generateStructures();
  return dsl;
};

export const generateDynamicDSL = () => {
  const dsl = createEmptyDSL();
  dsl.structures = generateDynamicStructures();
  return dsl;
};
