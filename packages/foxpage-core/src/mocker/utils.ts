import { Context, Mock, MockItem } from '@foxpage/foxpage-types';

export type MockMap = Record<string, MockItem>;

/**
 * get the used mock
 *
 * @param mocks mocks
 * @param ctx context
 * @returns page and extend mock
 */
export const getUsedMocks = (mocks: Mock[] = [], ctx: Context) => {
  const mockMap: Record<string, Mock> = {};
  mocks.forEach(item => {
    mockMap[item.id] = item;
  });

  const { mockId = '', extendId = '' } = ctx.getOrigin('page')?.extension || {};
  const pageMock = mockMap[mockId];
  let extendMock: Mock | null = null;
  if (extendId) {
    const extendMockId = ctx.getOrigin('extendPage')?.extension?.mockId;
    if (extendMockId) {
      extendMock = mockMap[extendMockId];
    }
  }

  return { pageMock, extendMock };
};

export const preMock = (mock: Mock) => {
  const idMockMap: MockMap = {};
  const typeMockMap: MockMap = {};
  mock?.schemas?.forEach(item => {
    if (item.id) {
      idMockMap[item.id] = item;
    } else if (item.name) {
      typeMockMap[item.name] = item;
    }
  });
  return { idMockMap, typeMockMap };
};

/**
 * merge props with mock
 * @param props
 * @param mockProps
 * @returns
 */
export const mergeProps = <T>(props: T, mockProps: MockItem['props'] = {}) => {
  return { ...props, ...mockProps } as T;
};
