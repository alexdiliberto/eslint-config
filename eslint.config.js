'use strict';

const globals = require('globals');
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
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/padding-line-between-statements': 'off',
    },
  },
];
