'use strict';

const config = require('./flat.js');

module.exports = [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'test/fake-files/**',
    ],
  },
  ...config,
  {
    // The repository uses trailing commas while the published config does not.
    rules: {
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      'padding-line-between-statements': 'off',
    },
  },
];
