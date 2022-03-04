import { createElement, FC } from 'react';

export const PLACEHOLDER = '/**__foxpage_debug*/';
export const PLACEHOLDER_ID = '__foxpage_debug_data__';

export const DebugPlaceholder: FC<Record<string, any>> = () =>
  createElement('script', {
    type: 'application/json',
    id: PLACEHOLDER_ID,
    dangerouslySetInnerHTML: {
      __html: PLACEHOLDER,
    },
  });
DebugPlaceholder.displayName = 'DebugDataPlaceholder';
