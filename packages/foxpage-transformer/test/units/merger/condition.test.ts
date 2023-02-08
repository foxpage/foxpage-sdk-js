import { Condition, conditionsMerge } from '../../../src';

describe('merger/condition', () => {
  it('no statics', () => {
    const dynamics: Condition[] = [
      {
        name: 'dynamic',
        id: '1',
        type: 1,
      },
    ];
    const result = conditionsMerge(undefined, dynamics);
    expect(result.length).toBe(1);
    expect(result).toContain(dynamics[0]);
  });

  it('no dynamics', () => {
    const statics: Condition[] = [
      {
        name: 'statics',
        id: '1',
        type: 1,
      },
    ];
    const result = conditionsMerge(statics);
    expect(result.length).toBe(1);
    expect(result).toContain(statics[0]);
  });

  it('condition combine', () => {
    const conditionOne: Condition[] = [
      {
        name: 'appShow',
        id: '76114710-7d45-11e9-a083-7ba6d477cc40',
        type: 1,
        props: {
          items: [
            {
              operation: 'eq',
              value: 'appShow1',
              key: '{{uaInfo.isFromApp}}',
            },
          ],
        },
      },
    ];

    const conditionTwo: Condition[] = [
      {
        name: 'appShow',
        id: '76114710-7d45-11e9-a083-7ba6d477cc40',
        type: 1,
        props: {
          items: [
            {
              operation: 'eq',
              value: '1',
              key: '{{uaInfo.isFromApp}}',
            },
          ],
        },
      },
      {
        name: 'appShow2',
        id: '76114710-7d45-11e9-a083-7ba6d477cc45',
        type: 2,
        props: {
          items: [
            {
              operation: 'eq',
              value: 'appShow2',
              key: '{{uaInfo.isFromApp}}',
            },
          ],
        },
      },
    ];

    const result = conditionsMerge(conditionOne, conditionTwo);
    expect(result.length).toBe(2);
    expect(JSON.stringify(result)).not.toMatch('appShow1');
    expect(JSON.stringify(result)).toMatch('appShow2');
  });
});
