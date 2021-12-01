import { FPPackage } from '@foxpage/foxpage-types';

import { PackageInstance, PackageManagerImpl } from '../../../src/package';

describe('Package manager', () => {
  let packageManager: PackageManagerImpl;

  beforeEach(() => {
    packageManager = new PackageManagerImpl('1000');
  });

  afterEach(() => {
    if (packageManager) {
      packageManager.destroy();
    }
  });

  it('Package manager: addPackage', () => {
    const pkg: FPPackage = require('../../data/package/demo.json');
    packageManager = new PackageManagerImpl('1000');
    packageManager.addPackage(new PackageInstance(pkg));
    const result = packageManager.getPackage(pkg.name, pkg.version);
    expect(result).toBeDefined();
    expect(result?.name).toBe(pkg.name);
    expect(result?.version).toBe(pkg.version);
  });

  it('Package manager: removePackages', () => {
    const pkg: FPPackage = require('../../data/package/demo.json');
    packageManager.addPackage(new PackageInstance(pkg));
    packageManager.removePackages([pkg.name]);
    const result = packageManager.getPackage(pkg.name, pkg.version);
    expect(result).toBeUndefined();
  });

  it('Package manager: getPackage return undefined', () => {
    const result = packageManager.getPackage('demo.test', '0.0.1');
    expect(result).toBeUndefined();
  });

  it('Package manager: getLivePackage', async () => {
    const pkg: FPPackage = require('../../data/package/demo.json');
    const liveVersion = '0.1.6'; // latest live version
    packageManager.addPackage(new PackageInstance(pkg));
    const newPkg = new PackageInstance({ ...pkg, version: liveVersion });
    await newPkg.install();
    packageManager.addPackage(newPkg);

    const result = packageManager.getLivePackage(pkg.name);
    expect(result).toBeDefined();
    expect(result?.name).toBe(pkg.name);
    expect(result?.version).toBe(liveVersion);
  });

  // it('Package manager: fetchPackages', async () => {
  //   const pkg: FPPackage = require('../../data/package/demo.json');
  //   // mock fetch return
  //   createFoxpageDataService({});
  //   jest.mock('Axios');
  //   // @ts-ignore
  //   Axios.post.mockResolvedValue({ data: { data: [pkg], code: 200 } });

  //   const result = await packageManager.fetchPackages();
  //   expect(result).toBeDefined();
  //   expect(result.length).toBe(1);
  //   expect(result[0].name).toBe(pkg.name);
  // });
});
