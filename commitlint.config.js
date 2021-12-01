'use strict';

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    "type-enum": [
      2,
      'always',
      [
        'build',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'chore',
        'style',
        'test'
      ]
    ],
  },
};
