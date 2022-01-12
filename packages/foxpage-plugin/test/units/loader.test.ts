import { PluginLoaderImpl } from '../../src/loader';

describe('Plugin loader test', () => {
  it('load plugin', () => {
    const pluginStr = '@foxpage/foxpage-plugin-function-parse';
    const loader = new PluginLoaderImpl({
      baseDir: process.cwd(),
      plugins: [pluginStr],
      api: {},
    });
    loader.load();
    const plugin = loader.getPlugin(pluginStr);
    // because it not export default
    expect(plugin).toBeDefined();
    expect(plugin?.name).toBe(pluginStr);
  });
});
