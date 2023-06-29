import { Block, Context, Mock, Page, StructureNode, Template } from '@foxpage/foxpage-types';

import { getUsedMocks, mergeProps, preMock } from './utils';

export interface MockOptions {
  // options
}

/**
 * parse content with mock
 * @param content
 * @param mock
 * @param extendMock
 * @returns
 */
export const mockContent = <T extends Page | Block>(content: T, mock: Mock | null, extendMock: Mock | null) => {
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

  dfs(content.schemas);

  return content;
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
 * parse block with mock
 * @param block
 * @param mock
 * @returns
 */
export const mockBlock = (block: Block, mock: Mock) => {
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

  dfs(block.schemas);

  return block;
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

  // deal with content (extend) mock
  // page or block
  let content = ctx.getOrigin('page');
  if (content) {
    const { pageMock, extendMock } = getUsedMocks(mocks, ctx);
    if (pageMock || extendMock) {
      content = mockContent(content as Page | Block, pageMock, extendMock);
    }
  }

  // deal with templates mock
  const templates = ctx.getOrigin('templates')?.map(item => {
    const { mockId = '' } = item.extension || {};
    const mock = mockMap[mockId];
    const result = mock ? mockTemplate(item, mock) : item;
    return result;
  });

  // deal with blocks mock
  const blocks = ctx.getOrigin('blocks')?.map(item => {
    const { mockId = '' } = item.extension || {};
    const mock = mockMap[mockId];
    const result = mock ? mockBlock(item, mock) : item;
    return result;
  });

  return { content, templates, blocks };
};
