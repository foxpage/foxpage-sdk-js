const globby = require('globby');
const fs = require('fs-extra');
const { join } = require('path');

const LIBRARY = 'library';
const MIN = '.min.';
const DIST = join(process.cwd(), LIBRARY);

async function findAllJs(root) {
  const jsFiles = await globby('**/*.js', {
    absolute: true,
    onlyFiles: true,
    cwd: root,
  });
  const files = jsFiles.map(filePath => ({
    filePath,
  }));
  return files;
}

async function update() {
  const root = DIST;
  const files = await findAllJs(root);
  const result = {};

  files.forEach(item => {
    const path = item.filePath.split(`${LIBRARY}/`)[1];
    if (path) {
      let pathKey = '';
      const list = path.split('.');
      const first = list[0];
      const last = list[list.length - 1];
      if (path.indexOf(MIN) > -1) {
        pathKey = `${first}${MIN}${last}`
      } else {
        pathKey = `${first}.${last}`
      }
      result[pathKey] = path;
    }
  });

  fs.outputJsonSync(root + '/manifest.json', result, { spaces: 2 });
}

update();

module.exports = {
  update,
}
