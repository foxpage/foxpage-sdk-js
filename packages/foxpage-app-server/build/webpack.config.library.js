const { npmModuleWebpackConfig } = require('./webpack.config.library.base');
const config = require('../foxpage.config');
const opts = config.libraries;

function getNpmModuleWebpackConfig(pkgName, opt) {
  return [
    npmModuleWebpackConfig(pkgName, { ...opt, prod: true }),
    npmModuleWebpackConfig(pkgName, { ...opt, prod: false }),
  ];
}

let cfg = [];
Object.keys(opts).forEach(key => {
  cfg = cfg.concat(getNpmModuleWebpackConfig(key, opts[key]));
})

module.exports = cfg;
