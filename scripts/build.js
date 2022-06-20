const { join, format } = require('path');
const chalk = require('chalk');
const { readdirSync, readJSONSync } = require('fs-extra');
const { execSync } = require('child_process');

const ROOT = join(process.cwd(), 'packages');

function getModules() {
  const packages = readdirSync(ROOT).filter(item => item.startsWith('foxpage'));
  return packages.map(item => readJSONSync(join(ROOT, item, 'package.json')));
}

function sortByDependency(modules = []) {
  const depMap = {};
  const moduleNames = modules.map(module => module.name);
  modules.forEach(module => {
    depMap[module.name] = {};
    Object.keys(module.dependencies || {}).forEach(item => {
      if (moduleNames.indexOf(item) > -1) {
        depMap[module.name][item] = module.dependencies[item];
      }
    });
    Object.keys(module.devDependencies || {}).forEach(item => {
      if (moduleNames.indexOf(item) > -1) {
        depMap[module.name][item] = module.devDependencies[item];
      }
    });
    Object.keys(module.peerDependencies || {}).forEach(item => {
      if (moduleNames.indexOf(item) > -1) {
        depMap[module.name][item] = module.peerDependencies[item];
      }
    });
  });

  // moduleA in moduleB
  const checkIn = (moduleA, moduleB) => {
    if (depMap[moduleB]) {
      if (depMap[moduleB][moduleA]) {
        return true;
      }
      const exist = Object.keys(depMap[moduleB]).findIndex(item => checkIn(moduleA, item));
      return exist > -1;
    }
    return false;
  };

  const sorts = [];
  moduleNames.forEach(item => {
    const moduleA = item;
    let idx = -1;
    for (let i = 0; i < sorts.length; i++) {
      const moduleB = sorts[i];
      const moduleAInModuleB = checkIn(moduleA, moduleB);
      if (moduleAInModuleB) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      sorts.splice(idx, 0, item);
    } else {
      sorts.push(item);
    }
  });

  return sorts;
}

function main() {
  console.log(chalk.yellow('[BUILD StART]'));
  const modules = sortByDependency(getModules());
  modules.forEach(module => {
    if (module !== '@foxpage/foxpage-types') {
      console.log(chalk.green(` [START BUILD] ${module}`));
      const dir = module.replace('@foxpage/', '');
      const path = format({
        dir: ROOT,
        base: dir,
      });
      execSync('yarn build', {
        cwd: path,
        stdio: 'inherit',
      });
      console.log(chalk.green(` [BUILD SUCCEED] ${module}`));
    }
  });
  console.log(chalk.yellow('[BUILD COMPLETE]'));
}

main();
