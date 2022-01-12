// import axios, { AxiosResponse } from 'axios';

// import mockAxios from 'jest-mock-axios';
import { Application, ApplicationOption, Content, FPApplication, TagManager } from '@foxpage/foxpage-types';

import { ApplicationImpl } from '@/application';
import { TagManagerImpl } from '@/tag/manager';
// const mockedAxios = axios as jest.Mocked<typeof axios>;

function initContent() {
  const content = {
    id: '111',
    tags: [{ pathname: '/demo' }],
    fileId: '123',
    title: 'demo test',
    createTime: '123456',
  } as Content;
  return content;
}

describe('tag/manager', () => {
  let app: Application;
  let tagManager: TagManager;

  beforeEach(() => {
    const info = {
      id: '1000',
    } as unknown as FPApplication;
    const opt = {} as unknown as ApplicationOption;
    app = new ApplicationImpl(info, opt);
    tagManager = new TagManagerImpl(app);
  });

  afterEach(() => {
    tagManager.destroy();
    app.destroy();
    app = null;
    tagManager = null;
    // mockAxios.reset();
  });

  it('addTag test', async () => {
    const content = initContent();

    // expect(mockAxios.post).toHaveBeenCalledWith('/content/tag-versions', { data: '13' });
    // const mockedResponse: AxiosResponse = {
    //   data: {},
    //   status: 200,
    //   statusText: 'OK',
    //   headers: {},
    //   config: {},
    // };
    // mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    // expect(axios.get).not.toHaveBeenCalled();
    // let result = await tagManager.matchTag(content.tags, { pathname: '/demo', fileId: content.fileId });
    // expect(axios.get).toHaveBeenCalled();
    // expect(result).toBeNull();
    tagManager.addTag(content);
    // result = await tagManager.matchTag(content.tags, { pathname: '/demo', fileId: content.fileId });
    // expect(result).toBeDefined();
  });
});
