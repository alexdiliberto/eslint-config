'use strict';

const { ESLint, Linter } = require('eslint');
const test = require('tape');
const { rules } = require('..');
const path = require('path');
const fs = require('fs/promises');

const baseTestFakeFileDir = path.resolve(path.join(__dirname, 'fake-files'));

// Test against the rules defined in this repository
const eslintOpts = {
  // ESLint v8 API
  useEslintrc: false,
  // When upgrading to ESLint v9, switch to: overrideConfigFile: false,
  overrideConfig: {
    env: { node: true, es2022: true },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    rules
  }
};

const cli = new ESLint(eslintOpts);

test('validate: load rules in eslint to validate all rule syntax is correct', async (t) => {
  const files = ['index.js'];
  const [report] = await cli.lintFiles(files);

  t.plan(4);

  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');
});

test('lint: js file with valid syntax', async (t) => {
  const files = [path.join(baseTestFakeFileDir, 'valid.js')];
  const [report] = await cli.lintFiles(files);

  t.plan(4);

  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');
});

test('lint: js file with invalid syntax', async (t) => {
  const files = [path.join(baseTestFakeFileDir, 'invalid.js')];
  const [report] = await cli.lintFiles(files);

  t.plan(4);

  t.equal(report.errorCount, 47, 'report.errorCount === 47');
  // All errors in this fixture should be fixable (by design)
  const allFixable = report.messages.every(m => m.fix != null);
  t.equal(allFixable, true, 'all reported errors are fixable');
  // Sanity checks
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');
});

test('fix: invalid.js is auto-fixed and idempotent', async (t) => {
  const file = path.join(baseTestFakeFileDir, 'invalid.js');
  const expected = await fs.readFile(
    path.join(baseTestFakeFileDir, 'invalid.fixed.js'),
    'utf8'
  );
  const cliFix = new ESLint({ ...eslintOpts, fix: true });
  const [report] = await cliFix.lintFiles([file]);
  
  t.plan(6);

  t.ok(report.output, 'eslint produced an output for invalid.js');
  t.equal(report.errorCount, 0, 'no remaining errors after fix');
  t.equal(report.fixableErrorCount, 0, 'no remaining fixable errors');
  t.equal(report.warningCount, 0, 'no warnings');

  // compare fixed output to our expected
  t.equal(report.output.trim(), expected.trim(), 'fixed output matches expected');

  // run again to ensure no more changes (idempotent)
  const fixedAgain = await cliFix.lintText(report.output, { filePath: file });
  t.notOk(fixedAgain[0].output, 'second pass makes no further changes');
});

test('consumer: extends @alexdiliberto works via symlinked node_modules', async (t) => {
  t.plan(2);

  const tmp = path.join(__dirname, '.tmp-consumer');
  const pkgDir = path.resolve(path.join(__dirname, '..'));
  const nodeModules = path.join(tmp, 'node_modules');
  const scopeDir = path.join(nodeModules, '@alexdiliberto');
  const targetDir = path.join(scopeDir, 'eslint-config');

  // ensure dirs
  await fs.mkdir(scopeDir, { recursive: true });

  // ensure our package has a package.json (sanity)
  const pkgJson = require(path.join(pkgDir, 'package.json'));
  t.equal(pkgJson.name, '@alexdiliberto/eslint-config', 'sanity: correct package name');

  // create/refresh symlink
  try { await fs.rm(targetDir, { recursive: true, force: true }); } catch {}
  await fs.symlink(pkgDir, targetDir, 'dir');

  // write a minimal consumer config and file
  await fs.writeFile(
    path.join(tmp, '.eslintrc.cjs'),
    `module.exports = { extends: ['@alexdiliberto'] };`
  );
  await fs.writeFile(
    path.join(tmp, 'sample.js'),
    `function ok(){ return 1 }\n`
  );

  // run ESLint from the temp directory so resolution uses that node_modules
  const cliConsumer = new ESLint({ cwd: tmp });
  const [report] = await cliConsumer.lintFiles(['sample.js']);

  const ruleNotFound = report.messages.some(m =>
    /Definition for rule .* was not found/.test(m.message)
  );

  t.equal(ruleNotFound, false, 'no missing rule definitions');

  // cleanup tmp dir
  await fs.rm(tmp, { recursive: true, force: true });
});

test('rules: report deprecated core rules (informational)', (t) => {
  const linter = new Linter();
  const coreRules = linter.getRules();
  const deprecated = new Set(
    [...coreRules.entries()]
      .filter(([, def]) => def?.meta?.deprecated)
      .map(([id]) => id)
  );

  const usedCoreRuleIds = Object.keys(rules).filter(id => coreRules.has(id));
  const deprecatedUsed = usedCoreRuleIds.filter(id => deprecated.has(id)).sort();

  if (deprecatedUsed.length) {
    t.comment(
      'Deprecated core rules in use (consider migrating to @stylistic):\n' +
      deprecatedUsed.map(r => `  - ${r}`).join('\n')
    );
  }

  t.pass('deprecated core rules reported');
  t.end();
});

test('package: publish payload is minimal', async (t) => {
  const pkg = require('../package.json');

  t.plan(4);

  t.ok(Array.isArray(pkg.files), '`files` field present');
  t.ok(pkg.files.includes('index.js'), 'index.js is included');
  t.ok(pkg.files.includes('README.md'), 'README.md is included');
  t.ok(pkg.files.includes('LICENSE'), 'LICENSE is included');
  t.end();
});