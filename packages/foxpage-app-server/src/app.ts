import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import foxpageRequestHandler from '@foxpage/foxpage-middleware-koa';

import { routes } from './routes';

const app = new Koa();

app.use(cors());

app.use(bodyParser());

app.use(routes);

app.use(foxpageRequestHandler());

export default app;
