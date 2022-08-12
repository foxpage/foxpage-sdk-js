import { findStructureById, findStructureByName } from '@/structure/finders';

describe('structure/finders', () => {
  it('findStructureByName test', () => {
    const structures = require('@@/data/structure/structures');
    const name = '@foxpage/cloud-flight-seo-csr-entry';
    const result = findStructureByName(structures, name);
    expect(result).toBeDefined();
    expect(result.name).toBe(name);
  });

  it('findStructureById test', () => {
    const structures = require('@@/data/structure/structures');
    const id = 'stru_mnqaep7OGra5XAK';
    const result = findStructureById(structures, id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
  });
});
