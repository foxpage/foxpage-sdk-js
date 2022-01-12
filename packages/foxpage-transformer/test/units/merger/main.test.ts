import { PageDSL } from '../../../src';
import { combine, combineAll, merge, replace, replaceAll } from '../../../src/merger';

import { generateDSL, generateDynamicDSL } from './helper/generateDSL';
import { DYNAMIC_MOUNT_NODE } from './helper/generateStructure';

describe('merger/main', () => {
  let staticDSL: PageDSL;
  let dynamicDSL: PageDSL;
  beforeEach(() => {
    // static structure
    // ---A---B
    //    |   |___C
    //    |___C
    //    |___M
    staticDSL = generateDSL();

    // dynamic
    // update [B,C,M-D]
    dynamicDSL = generateDynamicDSL();
  });
  it('dsl merge', async () => {
    const result = merge(staticDSL, dynamicDSL, { mountNode: DYNAMIC_MOUNT_NODE });
    const str = JSON.stringify(result);
    expect(str).toMatch('A-B-1');
    expect(str).toMatch('A-B-C');
    expect(str).toMatch('A-B');
    expect(str).toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-1');
    expect(str.split('C-1')?.length).toBe(2);
    expect(str).toMatch('M-D');
  });

  it('dsl replace', () => {
    const result = replace(staticDSL, dynamicDSL, { mountNode: DYNAMIC_MOUNT_NODE });
    const str = JSON.stringify(result);
    expect(str).not.toMatch('A-B-1');
    expect(str).not.toMatch('A-B-C');
    expect(str).not.toMatch('A-B');
    expect(str).not.toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).toMatch('C-1');
    expect(str.split('C-1')?.length).toBe(2);
    expect(str).toMatch('M-D');
  });

  it('dsl replaceAll', () => {
    const result = replaceAll(staticDSL, dynamicDSL, { mountNode: DYNAMIC_MOUNT_NODE });
    const str = JSON.stringify(result);
    expect(str).not.toMatch('A-B-1');
    expect(str).not.toMatch('A-B-C');
    expect(str).not.toMatch('A-B');
    expect(str).not.toMatch('A-C');
    expect(str).toMatch('B-1');
    expect(str).not.toMatch('C-1');
    expect(str).toMatch('C-2');
    expect(str.split('C-1')?.length).toBe(1); // no C-1
    expect(str.split('C-2')?.length).toBe(3); // two C-2
    expect(str).toMatch('M-D');
  });

  it('dsl combine', () => {
    const result = combine(staticDSL, dynamicDSL, { mountNode: DYNAMIC_MOUNT_NODE });
    const str = JSON.stringify(result);
    expect(str).toMatch('A');
    expect(str).toMatch('A-1');
    expect(str).toMatch('A-B');
    expect(str).toMatch('A-B-1');
    expect(str).toMatch('B-1');
    expect(str).toMatch('A-B-C');
    expect(str).toMatch('C-1');
    expect(str).toMatch('A-C');
    expect(str).toMatch('C-2');
    expect(str.split('C-1')?.length).toBe(2);
    expect(str.split('C-2')?.length).toBe(2);
    expect(str).toMatch('M-D');
  });

  it('dsl combine', () => {
    const result = combineAll(staticDSL, dynamicDSL, { mountNode: DYNAMIC_MOUNT_NODE });
    const str = JSON.stringify(result);
    expect(str).toMatch('A');
    expect(str).toMatch('A-1');
    expect(str).toMatch('A-B');
    expect(str).toMatch('A-B-1');
    expect(str).toMatch('B-1');
    expect(str).toMatch('A-B-C');
    expect(str).toMatch('C-1');
    expect(str).toMatch('A-C');
    expect(str).toMatch('C-2');
    expect(str.split('C-1')?.length).toBe(3);
    expect(str.split('C-2')?.length).toBe(3);
    expect(str).toMatch('M-D');
  });
});
