import * as _request from '@/data-service/request';

import { JestMockedFunctionRecord } from '../../helpers';

export type MockedRequestType = JestMockedFunctionRecord<typeof _request>;

export const request: MockedRequestType = _request as any;
