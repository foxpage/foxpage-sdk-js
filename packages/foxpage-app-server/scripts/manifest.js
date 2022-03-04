const globby = require('globby');
const fs = require('fs-extra');
const { join } = require('path');

const DIST = join(__dirname, '..', 'library');

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
    const path = item.filePath.replace(`${root}/`, '');
    const list = path.split('.');
    const length = list.length;

    let pathKey = '';
    if (path.indexOf('.min.') > -1) {
      pathKey = `${list[0]}.min.${list[length - 1]}`
    } else {
      pathKey = `${list[0]}.${list[length - 1]}`
    }

    // const relativePath = relative(root, path);
    result[pathKey] = path;
  });

  fs.outputJsonSync(root + '/manifest.json', result, { spaces: 2 });
}

update();

module.exports = {
  update,
}
