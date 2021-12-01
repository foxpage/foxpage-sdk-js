// import { join } from 'path';

// import heapdump from 'heapdump';

import * as foxpageSDK from '@foxpage/foxpage-node-sdk';

import app from './app';

const isDev = process.env.FOXPAGE_ENV === 'dev';
const PORT = isDev ? 3000 : 80;
if (isDev) {
  process.env.FOXPAGE_DEBUG = '1'; // dev open debug
}

Promise.all([foxpageSDK.init()]).then(() => {
  const server = app.listen(PORT, () => {
    console.log("App Say : Hi, I'm OK!");
    console.log(`Server running on port ${PORT}`);
  });
  server.keepAliveTimeout = 10 * 1000;
  server.headersTimeout = 65 * 1000;
});

// setInterval(() => {
//   const file = join(__dirname, Date.now() + '.heapsnapshot');
//   heapdump.writeSnapshot(file);
// }, 10 * 1000);
