import { FoxpageBuildHooks } from './build';
import { FoxpageDSLHooks } from './dsl';
import { FoxpageParseHooks } from './parse';
import { FoxpageRenderHooks } from './render';
import { FoxpageAppIgniteHooks } from './ignite';
import { FoxpageParserRegisterHooks } from './parser';
import { FoxpageContextHooks } from './context';
import { FoxpageRouterRegisterHooks } from './router';
import { StructureNode } from '../structure';
import { Context } from '../context'

export * from './build';
export * from './dsl';
export * from './parse';
export * from './render';
export * from './ignite';
export * from './parser';

export type FoxpageGetInitialPropsHooks = {
  getInitialProps?: (ctx: Context, node: StructureNode) => any;
}

export type FoxpageStaticComponent = Pick<FoxpageBuildHooks, 'beforeNodeBuild' | 'afterNodeBuild'> & FoxpageGetInitialPropsHooks;

export type FoxpageHooks =
  FoxpageBuildHooks &
  FoxpageDSLHooks &
  FoxpageParseHooks &
  FoxpageRenderHooks &
  FoxpageAppIgniteHooks &
  FoxpageParserRegisterHooks &
  FoxpageRouterRegisterHooks &
  FoxpageContextHooks;
