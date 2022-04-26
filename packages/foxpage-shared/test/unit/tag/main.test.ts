import { generateQueryStringByTags, generateTagByQuerystring, matchContent } from '../../../src/tag/main';

describe('tag main', () => {
  it('generate tag by url info', () => {
    const result = generateTagByQuerystring('locale=en_US&a=b');
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('match content', () => {
    const tags: any[] = [
      // {
      //   locale: 'en_US',
      //   status: true,
      // },
      // {
      //   query: {
      //     a: '1',
      //     b: '2',
      //   },
      // },
    ];
    const contents = [
      {
        id: '0',
        tags: [
          {
            locale: 'en_HK',
            status: true,
          },
        ],
        fileId: '0',
        title: 'demo-0',
        createTime: '1',
      },
      {
        id: '1',
        tags: tags,
        fileId: '1',
        title: 'demo-1',
        createTime: '2',
      },
    ];

    const result = matchContent(contents, tags);
    expect(result).toBeDefined();
    expect(result.id).toBe(contents[1].id);
  });

  it('match with weight', () => {
    const tags = [
      {
        locale: 'en_HK',
        status: true,
      },
      {
        query: {
          a: '1',
          b: '2',
        },
      },
    ];
    const contents = [
      {
        id: '0',
        tags: [
          {
            locale: 'en_HK',
            status: true,
          },
          {
            weight: 1,
          },
        ],
        fileId: '0',
        title: 'demo-0',
        createTime: '4',
      },
      {
        id: '1',
        tags: [
          {
            locale: 'en_HK',
            status: true,
          },
          {
            weight: 3,
          },
        ],
        fileId: '1',
        title: 'demo-1',
        createTime: '2',
      },
      {
        id: '2',
        tags: [
          {
            locale: 'en_HK',
            status: true,
          },
          {
            weight: 2,
          },
        ],
        fileId: '1',
        title: 'demo-2',
        createTime: '3',
      },
    ];
    const result = matchContent(contents, tags);
    expect(result).toBeDefined();
    expect(result.id).toBe(contents[1].id);
  });

  it('match many locale', () => {
    const contents = [
      {
        tags: [
          {
            locale: 'en-US',
          },
          {
            locale: 'zh-HK',
          },
          {
            query: {
              a: 'b',
            },
          },
        ],
        liveVersionNumber: 4,
        deleted: false,
        id: 'cont_Yxe7HevHPYffnOm',
        title: 'test-us-hk',
        fileId: 'file_3ThP7HdhN7S7Onn',
        creator: 'user-dvbfW1qsl8qkz39',
        createTime: '2021-08-30T08:23:26.912Z',
        updateTime: '2021-09-07T09:08:30.859Z',
      },
      {
        tags: [
          {
            locale: 'zh-HK',
          },
          {
            query: {
              a: 'a',
            },
          },
        ],
        liveVersionNumber: 21,
        deleted: false,
        id: 'cont_h0b6k8LcLIgUSHr',
        title: 'test-hk',
        fileId: 'file_3ThP7HdhN7S7Onn',
        creator: 'user-dvbfW1qsl8qkz39',
        createTime: '2021-09-03T03:21:58.734Z',
        updateTime: '2021-09-05T07:52:56.139Z',
      },
      {
        tags: [
          {
            locale: 'ja-JP',
          },
        ],
        liveVersionNumber: 7,
        deleted: false,
        id: 'cont_i8GinG3VthF8LUs',
        title: 'test-jp',
        fileId: 'file_3ThP7HdhN7S7Onn',
        creator: 'user-dvbfW1qsl8qkz39',
        createTime: '2021-08-31T08:24:00.759Z',
        updateTime: '2021-09-03T11:47:42.112Z',
      },
    ];
    const tags = [
      {
        locale: 'zh-HK',
      },
      {
        query: {
          a: 'a',
        },
      },
    ];
    const result = matchContent(contents, tags);
    expect(result).toBeDefined();
    expect(result.id).toBe(contents[1].id);
  });

  it('generate querystring', () => {
    const tags = [
      {
        locale: 'en-US',
      },
      {
        locale: 'zh-HK',
      },
      {
        query: {
          a: 'b',
        },
      },
    ];
    const result = generateQueryStringByTags(tags);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });
});
