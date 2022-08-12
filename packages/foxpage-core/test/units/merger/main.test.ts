import { Page, StructureNode } from '@foxpage/foxpage-types';

import { combineNode, merge, preMerge } from '@/merger';
import { MergeStrategy } from '@/merger/strategy';

import { getData } from '@@/data/merge/data';

describe('merger/main', () => {
  it('treeToRecord test', () => {
    const tree = getData().base;
    const result = preMerge(tree.schemas);
    expect(result).toBeDefined();
    const keys = Object.keys(result);
    expect(keys.length).toBe(10);
  });

  it('mergeNode test', () => {
    const one: StructureNode = {
      children: [],
      id: 'stru_uqzjriwLLTJ9t',
      label: 'script',
      name: '@fox-design/react-script',
      props: {
        code: 'window.__BF_CUSTOM_LOAD_FLAG__ = true;',
        list: [{ name: '111' }, { name: '222' }],
      },
      extension: {
        parentId: 'parent1',
        sort: 100,
      },
      type: 'react.component',
    };
    const two: StructureNode = {
      children: [],
      id: 'stru_uqzjriwLLTJ9t-9',
      label: 'script-1',
      name: '@fox-design/react-script',
      props: {
        code: 'window.__BF_CUSTOM_LOAD_FLAG__ = false;',
        list: [{ name: '333' }, { name: '222' }],
      },
      extension: {
        extendId: 'stru_uqzjriwLLTJ9t',
      },
      type: 'react.component',
    };
    const merged = combineNode(one, two);
    expect(merged).toBeDefined();
    expect(merged.props.list.length).toBe(2);
    expect(merged.props.list).not.toContain({ name: '111' });
    expect(merged.props.code).toContain('false');
    expect(merged.extension.extendId).toBe(one.id);
    expect(merged.extension.parentId).toBe(one.extension.parentId);
    expect(merged.extension.sort).toBe(one.extension.sort);
  });

  it('COMBINE_BY_EXTEND merge test', () => {
    const { base, current } = getData();
    const merged = merge(base, current, { strategy: MergeStrategy.COMBINE_BY_EXTEND });
    expect(merged).toBeDefined();
    const str = JSON.stringify(merged);
    expect(str).toContain('stru_bntlusFgCxauzb4-1');
    expect(str).toContain('csr-entry-1');
    expect(str).toContain('stru_bntlusFgCxauzb6');
  });

  it('COMBINE_BY_EXTEND merge test', () => {
    const { base, current } = getData();
    const merged = merge(base, current, { strategy: MergeStrategy.REPLACE_BY_NAME });
    expect(merged).toBeDefined();
    const str = JSON.stringify(merged);
    expect(str).toContain('new str');
    expect(str).not.toContain('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes');
  });

  it('COMBINE_BY_NAME merge test', () => {
    const { base, current } = getData();
    const merged = merge(base, current, { strategy: MergeStrategy.COMBINE_BY_NAME });
    expect(merged).toBeDefined();
    const str = JSON.stringify(merged);
    expect(str).toContain('new str');
    expect(str).toContain('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes');
  });

  it('COMBINE_BY_ID merge test', () => {
    const { base, current } = getData();
    const merged = merge(base, current, { strategy: MergeStrategy.COMBINE_BY_ID });
    expect(merged).toBeDefined();
    const str = JSON.stringify(merged);
    expect(str).toContain('new code');
    expect(str).toContain('window.__BF_CUSTOM_LOAD_FLAG__ = true;');
  });

  it('REPLACE_BY_ID merge test', () => {
    const { base, current } = getData();
    const merged = merge(base, current, { strategy: MergeStrategy.REPLACE_BY_ID });
    expect(merged).toBeDefined();
    const str = JSON.stringify(merged);
    expect(str).toContain('new code');
    expect(str).not.toContain('window.__BF_CUSTOM_LOAD_FLAG__ = true;');
  });

  it('DSL test', () => {
    const current = {
      id: 'cont_lU0AGtJMD8OweYD',
      relation: {},
      schemas: [
        {
          id: 'stru_tspgqvEzK0KwaWq',
          name: '@fox-design/react-text',
          label: '@fox-design/react-text',
          props: {
            text: 'Base content!!!11',
          },
          directive: {},
          extension: {
            extendId: 'stru_wwhkobWBDryUAil',
          },
        },
      ],
      extensions: {
        extendId: 'cont_jf8kOTmsfnZmBNV',
      },
      version: '1.0',
    } as unknown as Page;

    const base = {
      id: 'cont_jf8kOTmsfnZmBNV',
      schemas: [
        {
          id: 'stru_vpwqcuZl4uYCU4YB',
          name: '',
          type: '',
          props: {
            width: '100%',
            height: '100%',
          },
          children: [
            {
              id: 'stru_rftvzjtCstudkwC',
              label: '@fox-design/react-image',
              name: '@fox-design/react-image',
              props: {},
            },
            {
              id: 'stru_wwhkobWBDryUAil',
              label: '@fox-design/react-text',
              name: '@fox-design/react-text',
              props: {
                text: 'Base content!!!',
                tagName: 'div',
                textAlign: 'center',
                style: {
                  marginTop: '',
                  marginBottom: '',
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: '',
                },
              },
            },
          ],
          directive: {
            tpl: '{{__templates:cont_wlY8nusRmoyfQ5q:schemas}}',
          },
        },
      ],
      relation: {
        '__templates:cont_wlY8nusRmoyfQ5q:schemas': {
          id: 'cont_wlY8nusRmoyfQ5q',
          type: 'template',
        },
      },
      version: '1.0',
      extensions: {
        extendId: '',
      },
    } as unknown as Page;
    const merged = merge(base, current, { strategy: MergeStrategy.COMBINE_BY_EXTEND });
    expect(merged).toBeDefined();
  });
});
