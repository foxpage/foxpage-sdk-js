import { contentProxy } from '@/context/proxy';

describe('context/proxy', () => {
  it('contentProxy test', () => {
    const data = {
      a: 'test',
    };

    const proxy = contentProxy(data);
    expect(proxy.a).toBe(data.a);
    expect(proxy.b).toBeUndefined();
  });
});
