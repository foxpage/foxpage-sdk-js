import { PluginLoaderImpl } from '../../src/loader';

describe('Plugin loader test', () => {
  it('load plugin', () => {
    const pluginStr = 'fs-extra';
    const loader = new PluginLoaderImpl({
      baseDir: process.cwd() + '/packages/foxpage-plugin',
      plugins: [pluginStr],
      api: {},
    });
    loader.load();
    const plugin = loader.getPlugin(pluginStr);
    // because it not export default
    expect(plugin).toBeUndefined();
  });
});
