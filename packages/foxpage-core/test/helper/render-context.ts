import { ContentType } from '@foxpage/foxpage-shared';
import {
  Condition,
  ContentDetail,
  Context,
  ContextResource,
  Page,
  ParsedContent,
  Template,
  Variable,
} from '@foxpage/foxpage-types';

const page: Page = require('../data/page/page');

const renderContext = {
  appId: '10000',
  appSlug: 'test mock app',
  page: page,
  templates: {},
  variables: {},
  conditions: {},
  functions: {},
  origin: {},
  getOrigin: () => {},
  updatePage: () => {},
  updateOrigin: () => {},
  updateOriginPage: () => {},
  updateResource: () => {},
} as unknown as Context;

export const mockRenderContext = () => {
  return { ...renderContext };
};

export const mockRenderContextWithTemplate = (template: Template) => {
  const _renderContext = { ...renderContext };
  _renderContext.origin.templates = [template];
  return _renderContext;
};

export const mockRenderContextWithContent = (
  content: ContentDetail[],
  opt?: { parsed: Partial<ParsedContent> },
  context?: Context,
) => {
  const mockCtx = context || mockRenderContext();
  const ctx: Context = jest.fn().mockReturnValue({
    ...mockCtx,
    getOrigin: () => content,
    updateResource: (_target: string, _key: string, value: ParsedContent) => {
      if (!opt) {
        opt = {
          parsed: value,
        };
      } else {
        opt.parsed = value;
      }
    },
  })();

  return ctx;
};

export type ConditionParsed = Record<string, Partial<ParsedContent<Condition>>>;
export type VariableParsed = Record<string, Partial<ParsedContent<Variable>>>;

export const mockRenderContextWithConAndVariable = (
  condition: Condition,
  variable: Variable,
  opt: {
    conParsed: ConditionParsed;
    varParsed: VariableParsed;
  },
) => {
  const mockCtx = mockRenderContext();
  const ctx: Context = jest.fn().mockReturnValue({
    ...mockCtx,
    getOrigin: (target: keyof ContextResource) => {
      if (target === ContentType.CONDITION) {
        return [condition];
      }
      if (target === ContentType.VARIABLE) {
        return [variable];
      }
      return [];
    },
    updateResource: (target: keyof ContextResource, key: string, value: ParsedContent) => {
      if (target === ContentType.CONDITION) {
        opt.conParsed[key] = value.parsed as ParsedContent<Condition>;
      }
      if (target === ContentType.VARIABLE) {
        opt.varParsed[key] = value.parsed as ParsedContent<Variable>;
      }
    },
  })();

  return ctx;
};

export const mockRenderContextWithParsedContent = (
  ctx: Context,
  target: keyof ContextResource,
  content: Record<string, Partial<ParsedContent>>,
) => {
  return jest.fn().mockReturnValue({
    ...ctx,
    [target]: content || {},
  } as Context)();
};
