import { Condition, FPFunction, Page, Template, Variable } from '@foxpage/foxpage-types';

const page: Page = require('./page.json');
const template: Template = require('./template.json');
const variable: Variable = require('./variable.json');
const condition: Condition = require('./condition.json');
const fn: FPFunction = require('./function.json');

export { page, template, variable, condition, fn };
