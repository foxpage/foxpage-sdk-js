import { isString } from 'lodash';

import { ContentType } from '@foxpage/foxpage-shared';
import {
  Condition,
  ConditionExpression,
  ConditionParser,
  Context,
  ExpressionOperation,
  ParsedContent,
} from '@foxpage/foxpage-types';

import { executeString } from '../sandbox';

import { supportConditionTypes, supportOperations } from './config';
import { ConditionType } from './types';
import { isIncludesAble, transformRightTypeByLeft } from './utils';

export class ConditionParserImpl implements ConditionParser {
  /**
   * parse
   *
   * @param {Context} ctx
   */
  public parse(ctx: Context) {
    const conditions = ctx.getOrigin(ContentType.CONDITION);

    conditions?.forEach(item => {
      const result = this.parseOne(item, ctx);

      ctx.updateResource(ContentType.CONDITION, item.id, {
        content: item,
        parsed: result.parsed,
        parseMessages: result.parseMessages,
        parseStatus: result.parseStatus,
      });
    });
  }

  public parseOne(condition: Condition, ctx: Context) {
    const parsed: Partial<ParsedContent<Condition, boolean>> = {
      parseStatus: true,
      parseMessages: [],
    };

    if (!condition) {
      parsed.parsed = false;
      parsed.parseMessages = ['condition is null'];
      return parsed;
    }

    const conditionItem = condition.schemas[0];

    if (!conditionItem.type || !supportConditionTypes.includes(conditionItem.type)) {
      parsed.parseStatus = false;
      parsed.parseMessages = [
        `condition type: "${conditionItem.type}" not support in "${JSON.stringify(ConditionType)}"`,
      ];
      return parsed;
    }

    const _expressions = conditionItem.children || [];
    const expressions = _expressions.filter(Boolean);

    // if no expression always false.
    if (expressions.length === 0) {
      parsed.parsed = false;
      return parsed;
    }

    try {
      switch (conditionItem.type) {
        case ConditionType.AND:
          parsed.parsed = expressions.every(expression => this.parseExpression(expression, ctx, parsed.parseMessages));
          break;
        case ConditionType.OR:
          parsed.parsed = expressions.some(expression => this.parseExpression(expression, ctx, parsed.parseMessages));
          break;
        default:
          parsed.parseMessages = [`condition type: "${conditionItem.type}" not support in [${supportConditionTypes}]`];
          parsed.parsed = false;
          break;
      }
    } catch (err) {
      parsed.parseMessages?.push((err as Error).message);
      parsed.parsed = false;
      return parsed;
    }

    return parsed;
  }

  private parseExpression(expression: ConditionExpression, ctx: Context, parseMessages: string[] = []): boolean {
    const messages: string[] = [];
    if (!expression) {
      return false;
    }

    const { key, operation, value } = expression.props;
    const left = executeString<unknown>(key, ctx.variables, messages);

    if (messages.length > 0) {
      throw new Error(`parse key '${key}' fail.`);
    }

    const right: unknown = isString(value)
      ? transformRightTypeByLeft(left, executeString(value, ctx.variables, messages))
      : value;

    if (messages.length) {
      throw new Error(`parse value '${value}' fail`);
    }

    let result = false;
    let reg: RegExp | null;

    switch (operation.toLowerCase() as ExpressionOperation) {
      case 'lt':
        result = (left as number) < (right as number);
        break;
      case 'lt_eq':
        result = (left as number) <= (right as number);
        break;
      case 'gt':
        result = (left as number) > (right as number);
        break;
      case 'gt_eq':
        result = (left as number) >= (right as number);
        break;
      case 'eq':
        result = left == right;
        break;
      case 'un_eq':
        result = left != right;
        break;
      case 'ct':
        result = isIncludesAble(left) && left.includes(right);
        break;
      case 'un_ct':
        result = isIncludesAble(left) && !left.includes(right);
        break;
      case 'in_array':
        result = Array.isArray(right) && right.includes(left);
        break;
      case 'un_in_array':
        result = Array.isArray(right) && !right.includes(left);
        break;
      case 'regex':
        reg = isString(right) ? new RegExp(right) : right instanceof RegExp ? right : null;
        result = (typeof left === 'string' && reg?.test(left)) || false;
        break;
      case 'un_regex':
        reg = isString(right) ? new RegExp(right) : right instanceof RegExp ? right : null;
        result = typeof left === 'string' && !reg?.test(left);
        break;
      case 'regex_uncase':
        reg = isString(right) ? new RegExp(right, 'i') : right instanceof RegExp ? right : null;
        result = (typeof left === 'string' && reg?.test(left)) || false;
        break;
      case 'un_regex_uncase':
        reg = isString(right) ? new RegExp(right, 'i') : right instanceof RegExp ? right : null;
        result = typeof left === 'string' && !reg?.test(left);
        break;
      case 'sw':
        result = isString(left) && isString(right) && left.startsWith(right);
        break;
      case 'un_sw':
        result = isString(left) && isString(right) && !left.startsWith(right);
        break;
      case 'ew':
        result = isString(left) && isString(right) && left.endsWith(right);
        break;
      case 'un_ew':
        result = isString(left) && isString(right) && !left.endsWith(right);
        break;
      default:
        const msg = `expression "${JSON.stringify(
          expression,
        )}" operation ${operation} not support in [${supportOperations}]`;
        throw new Error(msg);
    }
    const msg = `expression "${key}" ${operation} "${value}" value: ${result}.("${key}" -> "${
      left ? JSON.stringify(left) : ''
    }")`;
    messages.push(msg);
    messages.forEach(item => {
      parseMessages.push(item);
    });
    return result;
  }
}
