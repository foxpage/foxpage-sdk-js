import { NodeCondition } from '../manager';

export type DirectiveIFItem = string | NodeCondition;

export interface Directive {
  on?: string;
  if?: DirectiveIFItem[];
  for?: string;
  tpl?: string;
}
