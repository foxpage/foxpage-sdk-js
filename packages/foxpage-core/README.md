# Foxpage core

Foxpage core, contains `parser`,`merger`eg.

## Dsl merge

```ts
import { merger } from '@foxpage/foxpage-core';

const result = merger.merge(baseContent, curContent, {
  strategy: merger.MergeStrategy.COMBINE_BY_EXTEND,
});
```
