import { VariableParseEntity } from '../parser';

export interface FoxpageParserRegisterHooks {
  registerVariableParser?: () => VariableParseEntity;
}
