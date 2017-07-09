'use strict';

const CLIEngine = require('eslint').CLIEngine;
const test = require('tape');
const rules = require('../').rules;

// Source files to lint
const files = [
  'index.js'
];

// Test against the rules defined in this repo
const eslintOpts = {
  useEslintrc: false,
  envs: ['node', 'es6'],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules
};

const cli = new CLIEngine(eslintOpts);

test('load rules in eslint to validate all rule syntax is correct', function(t) {
  // Runs the linter on the repo files and asserts no errors
  let report = cli.executeOnFiles(files);

  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');

  t.end();
});
