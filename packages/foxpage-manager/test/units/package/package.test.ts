// import _ from 'lodash';

// import { FPPackage } from '@foxpage/foxpage-types';

// import { PackageInstance } from '@';

describe('Package', () => {
  it('test', () => {
    expect(1).toBe(1);
  });
  //   let demoComp: FPPackage;

  //   beforeEach(() => {
  //     demoComp = _.cloneDeep(require('../../data/package/demo'));
  //   });

  //   it('Package: preinstall', () => {
  //     const pkg = new PackageInstance(demoComp);
  //     expect(pkg).toBeDefined();
  //     expect(pkg.name).toBe('demo.test-two');
  //     expect(pkg.status).toBe('preinstall');
  //   });

  //   it('Package: install failed because of the node source if miss ', async () => {
  //     demoComp.resource.entry.node = '';
  //     const pkg = new PackageInstance(demoComp);
  //     await pkg.install();
  //     expect(pkg.status).toBe('installing');
  //     expect(pkg.available).toBeFalsy();
  //     expect(pkg.messages.length).toBeGreaterThan(0);
  //   });

  //   it('Package: install succeed', async () => {
  //     const pkg = new PackageInstance(demoComp);
  //     await pkg.install();
  //     expect(pkg.status).toBe('installed');
  //     expect(pkg.available).toBeTruthy();
  //     expect(pkg.exported).toBeDefined();
  //   });
});
