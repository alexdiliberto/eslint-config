'use strict';

const { ESLint } = require('eslint');
const test = require('tape');
const rules = require('..').rules;
const path = require('path');

const baseTestFakeFileDir = path.resolve(path.join(__dirname, './fake-files/'));

// Test against the rules defined in this repository
const eslintOpts = {
  useEslintrc: false,
  overrideConfig: {
    env: {
      node: true,
      es6: true,
    },
    parserOptions: {
      ecmaVersion: 2019
    },
    rules
  }
};

const cli = new ESLint(eslintOpts);

test('validate: load rules in eslint to validate all rule syntax is correct', async (t) => {
  // Source files to lint
  let files = ['index.js'];

  // Runs the linter on the given files
  let [report] = await cli.lintFiles(files);

  t.plan(4);

  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');

  t.end();
});

test('lint: js file with valid syntax', async (t) => {
  // Source files to lint
  let files = [`${baseTestFakeFileDir}/valid.js`];

  // Runs the linter on the given files
  let [report] = await cli.lintFiles(files);

  t.plan(4);

  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');

  t.end();
});

test('lint: js file with invalid syntax', async (t) => {
  // Source files to lint
  let files = [`${baseTestFakeFileDir}/invalid.js`];

  // Runs the linter on the given files
  let [report] = await cli.lintFiles(files);

  t.plan(5);

  t.equal(report.errorCount, 7, 'report.errorCount === 7');
  t.deepEqual(report.messages.map((msg) => msg.ruleId), [
    'consistent-return',
    'space-before-blocks',
    'indent',
    'curly',
    'block-spacing',
    'brace-style',
    'eol-last'
  ], 'correct lint error ids');
  t.equal(report.fixableErrorCount, 6, 'report.fixableErrorCount === 6');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');

  t.end();
});