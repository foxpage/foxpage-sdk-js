import { ApplicationImpl } from '@foxpage/foxpage-manager';
import { Application, ContentRelationInfo, Page } from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from '@/api';
import { appTask, contextTask, pageTask, parseTask, renderTask, tagTask } from '@/task/main';

const contextOpt = {
  request: {
    URL: new URL('http://localhost:8080/demo'),
  },
} as unknown as FoxpageRequestOptions;

describe('task/main', () => {
  let app: Application;
  beforeEach(() => {
    app = new ApplicationImpl(
      {
        id: '1000',
        name: 'demo',
        settings: {},
        slug: '/demo',
        intro: '',
      },
      {},
    );
  });

  afterEach(() => {
    app.destroy();
    app = null;
  });

  it('appTask test: slug is null', () => {
    const pathname = 'demo';
    const result = appTask(pathname);
    expect(result).toBeNull();
  });

  it('appTask test: slug is valid', () => {
    const pathname = '/demo';
    const result = appTask(pathname);
    // not real slug
    expect(result).toBeUndefined();
  });

  it('contextTask test', async () => {
    const ctx = await contextTask(app, contextOpt);
    expect(ctx).toBeDefined();
    expect(ctx.appId).toBe('1000');
  });

  it('tagTask test', async () => {
    const ctx = await contextTask(app, contextOpt);
    app.tagManager.matchTag = async () => {
      return null;
    };
    const result = await tagTask(app, ctx);
    expect(result).toBeNull();
  });

  it('pageTask test: isPreviewMode', async () => {
    const content = { id: '100' };
    const ctx = await contextTask(app, contextOpt);
    ctx.isPreviewMode = true;
    app.pageManager.getDraftPages = async () => {
      return [{ content, relations: [] }] as unknown as ContentRelationInfo[];
    };
    const result = await pageTask(content.id, app, ctx);
    expect(result).toBeDefined();
    expect(result).toEqual(content);
  });

  it('pageTask test: not PreviewMode', async () => {
    const content = { id: '100', schemas: [] } as Page;
    const ctx = await contextTask(app, contextOpt);
    app.pageManager.getPage = async () => {
      return content;
    };
    const result = await pageTask(content.id, app, ctx);
    expect(result).toBeDefined();
    expect(result).toEqual(content);
  });

  it('parseTask test', async () => {
    const content = { id: '100', schemas: [] } as Page;
    const ctx = await contextTask(app, contextOpt);
    const result = await parseTask(content, ctx);
    expect(result).toBe('');
  });

  it('renderTask test', async () => {
    const content = { id: '100', schemas: [] } as Page;
    const ctx = await contextTask(app, contextOpt);
    const result = await renderTask(content, ctx);
    expect(result).toBe('');
  });
});
