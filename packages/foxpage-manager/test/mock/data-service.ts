import { foxpageDataService } from '@/data-service/service';

import { JestMockedFunctionRecord } from '@@/helpers/types';

export type MockedDataServiceType = JestMockedFunctionRecord<typeof foxpageDataService>;

export const dataService: MockedDataServiceType = foxpageDataService as any;
