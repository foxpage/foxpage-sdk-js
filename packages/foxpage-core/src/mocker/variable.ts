import { ContentType } from '@foxpage/foxpage-shared';
import { Context, Variable } from '@foxpage/foxpage-types';

import { getUsedMocks, preMock } from './utils';

/**
 * variable mock
 * @param variables
 * @param ctx
 * @returns mocked variables
 */
export const withVariableMock = (variables: Variable[] = [], ctx: Context) => {
  if (variables.length === 0) {
    return [];
  }

  // get mocks from ctx
  // this data will init before parse lifecycle
  const { pageMock, extendMock } = getUsedMocks(ctx.getOrigin('mocks'), ctx);
  if (pageMock || extendMock) {
    const { idMockMap = {} } = pageMock ? preMock(pageMock) : {};
    const { idMockMap: extendIdMockMap = {} } = extendMock ? preMock(extendMock) : {};

    variables.forEach(variable => {
      const { id, schemas = [] } = variable || {};
      // variable content only had one schema node
      const variableItem = schemas[0];
      if (variableItem) {
        let mock = idMockMap[id]; // id
        if (!mock) {
          mock = extendIdMockMap[id]; //extend id
        }
        if (mock) {
          // update variable mock to ctx
          ctx.updateResource(ContentType.VARIABLE, variableItem.name, {
            content: variable,
            parsed: mock.props.value,
            parseStatus: true,
            parseMessages: ['variable mocked'],
          });
        }
      }
    });
  }

  return variables;
};
