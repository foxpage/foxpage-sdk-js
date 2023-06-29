import { Context } from '../context';
import { StructureNode } from '../structure';

import { FoxpageBuildHooks } from './build';
import { FoxpageContextHooks } from './context';
import { FoxpageDSLHooks } from './dsl';
import { FoxpageAppIgniteHooks } from './ignite';
import { FoxpageParseHooks } from './parse';
import { FoxpageParserRegisterHooks } from './parser';
import { FoxpageRenderHooks } from './render';
import { FoxpageRouterRegisterHooks } from './router';

export * from './build';
export * from './dsl';
export * from './parse';
export * from './render';
export * from './ignite';
export * from './parser';

export type FoxpageGetInitialPropsHooks = {
  getInitialProps?: (ctx: Context, node: StructureNode) => any;
};

export type FoxpageStaticComponent = Pick<FoxpageBuildHooks, 'beforeNodeBuild' | 'afterNodeBuild'> &
  FoxpageGetInitialPropsHooks;

export type FoxpageHooks = FoxpageBuildHooks &
  FoxpageDSLHooks &
  FoxpageParseHooks &
  FoxpageRenderHooks &
  FoxpageAppIgniteHooks &
  FoxpageParserRegisterHooks &
  FoxpageRouterRegisterHooks &
  FoxpageContextHooks;
