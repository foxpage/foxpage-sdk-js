import { Context, ParsedContent } from '../../context';
import { Condition } from '../../manager';

export interface ConditionParser {
  parse(ctx: Context): void;
  parseOne(condition: Condition, ctx: Context): Partial<ParsedContent<Condition, boolean>>;
}
