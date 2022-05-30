import { mocker } from '@foxpage/foxpage-core';
import { createContentInstance, variable } from '@foxpage/foxpage-shared';
import { ContentDetail, Context, Mock, Page, RelationInfo, RenderAppInfo } from '@foxpage/foxpage-types';

import { createRenderContext } from '../context';

export type MockOption = { appInfo: RenderAppInfo; relationInfo: RelationInfo & { extendPage?: Page } };

/**
 * whit mock
 * @param page page content
 * @param mocks mocks
 * @param opt mock options
 */
export const withMock = (page: Page, mocks: Mock[], opt: MockOption) => {
  // init ctx
  const ctx: Context = createRenderContext(opt.appInfo);
  const { extendPage, ...rest } = opt.relationInfo;
  const contentInstances = createContentInstance({ ...rest, page: [page] });
  ctx.updateOrigin({
    ...contentInstances,
    sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
  });
  const pageInstance = contentInstances.page[0];
  ctx.updateOriginPage(pageInstance);
  ctx.updateOriginByKey('extendPage', extendPage);

  const result = mocker.withMock(mocks, ctx);
  return result;
};
