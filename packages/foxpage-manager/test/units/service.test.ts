import { Manager, ManagerOption } from '@foxpage/foxpage-types';

// import { getApplication, getApplicationByName, getManager, initManager } from '../../src/service';
import { getManager, initManager } from '../../src/service';

const opt = {
  apps: [{ appId: 'appl_RxwAUtpQUXqgkzQ', options: {} }],
  dataService: { host: 'http://api.foxfamily.io' },
} as ManagerOption;

describe('Service', () => {
  let manager: Manager;

  beforeEach(async () => {
    manager = await initManager(opt);
  });

  afterEach(() => {
    if (manager) {
      manager.clear();
    }
  });

  it('GetManager', () => {
    const manager = getManager();
    expect(manager).toBeDefined();

    const managerApp = manager.getApplication(opt.apps[0].appId);
    expect(managerApp?.appId).toBe(opt.apps[0].appId);
  });

  // it('GetApplication', () => {
  //   const appId = opt.apps[0].appId;
  //   const application = getApplication(appId);
  //   expect(application).toBeDefined();
  //   expect(application?.appId).toBe(appId);
  // });

  // it('GetApplicationByName', () => {
  //   const appName = opt.apps[0].appName;
  //   const application = getApplicationByName(appName);
  //   expect(application).toBeDefined();
  //   expect(application?.slug).toBe(appName);
  // });

  // it('InitManager new app same name', async () => {
  //   const newApp = { appId: 'appl-IHrJ78GJ_aioGD1', appName: 'App-1' };
  //   try {
  //     await initManager({ apps: [newApp], dataService: { host: '', path: '' } });
  //   } catch (e) {
  //     expect(e).toBeDefined();
  //     expect(e.message).toBe('Init manager failed: "init applications failed"');
  //   }
  // });

  // it('InitManager new app', async () => {
  //   const newApp = { appId: '1001', appName: 'new test app' };
  //   const manager = await initManager({ apps: [newApp], dataService: { host: '', path: '' } });
  //   expect(manager).toBeDefined();

  //   const managerOldApp = manager.getApplication(opt.apps[0].appId);
  //   expect(managerOldApp).toBeDefined();
  //   expect(managerOldApp?.appId).toBe(opt.apps[0].appId);

  //   const managerApp = manager.getApplication(newApp.appId);
  //   expect(managerApp).toBeDefined();
  //   expect(managerApp?.appId).toBe(newApp.appId);
  // });
});
