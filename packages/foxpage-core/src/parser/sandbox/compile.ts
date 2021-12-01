import { isPlainObject } from 'lodash';

import { MATCH_EXPRESSION_REGEX } from './constant';
import { IProps, Messages } from './interface';
import { evalWithScope } from './main';

const ARG_VARIABLES = 'variables';
const ARG_MESSAGES = 'messages';
const STRINGIFY_FN_NAME = '$stringify';

export type PropsGetter = (variables: Record<string, any>, messages: any[]) => IProps;

function createPropDeclarator(val: any, varDeclarations: string[]): any {
  if (typeof val === 'string') {
    if (val.startsWith('{{') && val.indexOf('}}') === val.length - 2) {
      const expression = val.substring(2, val.length - 2);
      const objKey = `$ref_${varDeclarations.length}`;
      const varDeclaration = createExpressionDeclarator(objKey, expression);
      varDeclarations.unshift(varDeclaration);
      return objKey;
    }
    const quotationMark = !val.includes('`') ? '`' : !val.includes(`"`) ? '"' : "'";
    if (MATCH_EXPRESSION_REGEX.test(val)) {
      const replaced = val.replace(MATCH_EXPRESSION_REGEX, (_match, expression) => {
        const objKey = `$ref_${varDeclarations.length}`;
        const varDeclaration = createExpressionDeclarator(objKey, expression);
        varDeclarations.unshift(varDeclaration);
        return `${quotationMark} + ${STRINGIFY_FN_NAME}(${objKey}) + ${quotationMark}`;
      });
      return `${quotationMark}${replaced}${quotationMark}`;
    } else {
      return `${quotationMark}${val}${quotationMark}`;
    }
  } else if (isPlainObject(val)) {
    return createObjectDeclarator(val, varDeclarations);
  } else if (Array.isArray(val)) {
    return createArrayDeclarator(val, varDeclarations);
  }
  return val;
}

function createExpressionDeclarator(key: string, expression: string) {
  const safeExpression = decodeURIComponent(expression);
  const declarator = `const ${key} = (function iife(){
    try {
      with (${ARG_VARIABLES}) {
        return ${expression};
      }
    } catch (error) {
      ${ARG_MESSAGES}.push(\`parse string "${safeExpression}" fail, reason:\` + (error && error.message));
      return undefined;
    }
  })();`;
  return declarator;
}

function createArrayDeclarator(arr: any[], varDeclarations: string[] = []) {
  let declarator = `[\n`;
  for (const v of arr) {
    declarator += `${createPropDeclarator(v, varDeclarations)},\n`;
  }
  declarator += ']';
  return declarator;
}

function createObjectDeclarator(props: IProps, varDeclarations: string[] = []): string {
  let declarator = `{\n`;
  for (const [k, v] of Object.entries(props)) {
    declarator += `${k}: ${createPropDeclarator(v, varDeclarations)},\n`;
  }
  declarator += '}';
  return declarator;
}

export function compilePropsToGetter(props: IProps = {}, _messages: Messages = []): PropsGetter {
  const clone = { ...props };
  delete clone.children;
  const varDeclarations: string[] = [];
  const declarator = createObjectDeclarator(clone, varDeclarations);
  const fn = `function __props_getter(${ARG_VARIABLES}, ${ARG_MESSAGES}) {
    const ${STRINGIFY_FN_NAME} = function ${STRINGIFY_FN_NAME}(val) {
      if (typeof val === 'object' && val !== null && Object.getPrototypeOf(val) === Object.prototype) {
        try {
          return JSON.stringify(val);
        } catch (error) {}
      }
      return String(val);
    };
    ${varDeclarations.join('\n')}\n
    const __ret = ${declarator};
    return __ret;
  }`;
  const getter = evalWithScope({}, fn) as PropsGetter;
  return getter;
}
