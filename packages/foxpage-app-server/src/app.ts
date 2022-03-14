import { join } from 'path';

import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

import foxpageRequestHandler from '@foxpage/foxpage-middleware-koa';

import { routes } from './routes';

const app = new Koa();

const debug = serve(join(__dirname, '..', '..', 'foxpage-debug-portal', 'dist'));
const library = serve(join(__dirname, '..', 'library'));

app.use(cors());

app.use(bodyParser());

app.use(routes);

app.use(foxpageRequestHandler());

app.use(debug);
app.use(library);

export default app;
