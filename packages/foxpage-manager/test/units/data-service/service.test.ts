import { ManagerOption } from '@foxpage/foxpage-types';

import { createFoxpageDataService, FoxpageDataService } from '../../../src/data-service/service';

const appId = 'appl-sRTuNlueu6FNK';

describe('Data service', () => {
  let dataService: FoxpageDataService;

  beforeAll(() => {
    const opt = {
      apps: [{ appId: '1000', options: {} }],
      dataService: { host: '', path: '' },
    } as ManagerOption;
    dataService = createFoxpageDataService(opt.dataService);
  });

  it('FetchAppLivePackages', async () => {
    try {
      await dataService.fetchAppPackages(appId, {});
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppPages', async () => {
    try {
      await dataService.fetchAppPages(appId, { pageIds: ['page-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppTemplates', async () => {
    try {
      await dataService.fetchAppTemplates(appId, { templateIds: ['page-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppContent', async () => {
    try {
      await dataService.fetchAppContentByTags(appId, '/demo', [{ key: 'lcoale', value: 'en_US' }]);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppContents', async () => {
    try {
      await dataService.fetchAppContents(appId, { contentIds: ['cont-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppFunctions', async () => {
    try {
      await dataService.fetchAppFunctions(appId, { functionIds: ['func-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppConditions', async () => {
    try {
      await dataService.fetchAppConditions(appId, { conditionIds: ['cont-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('FetchAppVariables', async () => {
    try {
      await dataService.fetchAppVariables(appId, { variableIds: ['vari-GHHxHdmn_y_E5pg'] });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
