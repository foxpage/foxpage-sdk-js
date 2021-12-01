const pm2 = require('pm2');
const { join } = require('path');
const { promisify } = require('util');
const rm = require('rimraf');

const cwd = __dirname;
const name = 'foxpage';

const script = join(cwd, 'lib/server.js');
const logDir = join(cwd, 'log');

function startPM2() {
  /** @type {import('pm2').StartOptions} */
  const option = {
    name,
    cwd,
    script,
    output: join(logDir, 'out.log'),
    error: join(logDir, 'err.log'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    instances: process.env.PM2_INSTANCE || 4,
    env: {},
  };

  return new Promise((resolve, reject) => {
    try {
      pm2.start(option, (err, proc) => {
        err ? reject(err) : resolve(proc);
      });
    } catch (error) {
      reject(err);
    }
  });
}

function clean() {
  return new Promise(resolve => {
    pm2.delete(name, (err, proc) => {
      rm(logDir, err => {
        resolve();
      });
    });
  });
}

async function main() {
  try {
    await clean();
    console.log('\n  start pm2\n');
    await startPM2();
    console.log('pm2 start success!');
    const bus = await promisify(pm2.launchBus.bind(pm2))();
    bus.on('restart', reason => {
      console.warn('restart because:', reason);
    });
  } catch (error) {
    console.error('pm2 start fail:', error);
  }
}

main();
