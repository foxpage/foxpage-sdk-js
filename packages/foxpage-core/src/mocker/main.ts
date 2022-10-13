import { Context, Mock, Page, StructureNode, Template } from '@foxpage/foxpage-types';

import { getUsedMocks, mergeProps, preMock } from './utils';

export interface MockOptions {}

/**
 * parse page with mock
 * @param page
 * @param mock
 * @param extendMock
 * @returns
 */
export const mockPage = (page: Page, mock: Mock | null, extendMock: Mock | null) => {
  const { idMockMap = {}, typeMockMap = {} } = mock ? preMock(mock) : {};
  const { idMockMap: extendIdMockMap = {}, typeMockMap: extendTypeMockMap = {} } = extendMock
    ? preMock(extendMock)
    : {};

  const dfs = (list: StructureNode[] = []) => {
    list.forEach(item => {
      let mock = idMockMap[item.id]; // id
      if (!mock) {
        mock = typeMockMap[item.name]; // name
      }
      if (!mock) {
        mock = extendIdMockMap[item.id]; //extend id
      }
      if (!mock) {
        mock = extendTypeMockMap[item.name]; //extend name
      }
      if (mock) {
        item.props = mergeProps<StructureNode['props']>(item.props, mock.props);
      }
      if (item.children?.length) {
        dfs(item.children);
      }
    });
  };

  dfs(page.schemas);

  return page;
};

/**
 * parse template with mock
 * @param template
 * @param mock
 * @returns
 */
export const mockTemplate = (template: Template, mock: Mock) => {
  const { idMockMap = {}, typeMockMap = {} } = mock ? preMock(mock) : {};

  const dfs = (list: StructureNode[] = []) => {
    list.forEach(item => {
      let mock = idMockMap[item.id]; // id
      if (!mock) {
        mock = typeMockMap[item.name]; // name
      }
      if (mock) {
        item.props = mergeProps(item.props, mock.props);
      }
      if (item.children?.length) {
        dfs(item.children);
      }
    });
  };

  dfs(template.schemas);

  return template;
};

/**
 * with mock
 * merge mock data to contents
 * @param mocks
 * @param ctx
 * @param opt
 * @returns
 */
export const withMock = (mocks: Mock[], ctx: Context, _opt?: MockOptions) => {
  const mockMap: Record<string, Mock> = {};
  mocks.forEach(item => {
    mockMap[item.id] = item;
  });

  let page = ctx.getOrigin('page');
  // deal with page (extend) mock
  if (page) {
    const { pageMock, extendMock } = getUsedMocks(mocks, ctx);
    if (pageMock || extendMock) {
      page = mockPage(page, pageMock, extendMock);
    }
  }

  // deal with templates mock
  const templates = ctx.getOrigin('templates')?.map(item => {
    const { mockId = '' } = item.extension || {};
    const templateMock = mockMap[mockId];
    const template = templateMock ? mockTemplate(item, templateMock) : item;
    return template;
  });

  return { page, templates };
};
