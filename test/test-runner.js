// test/test-runner.js
'use strict';

const { ESLint } = require('eslint'); // ESLint v9 API
const test = require('tape');
const path = require('path');
const fs = require('fs/promises');

// Load the package's flat config (CJS array export)
const flatConfig = require('../flat.js');
if (!Array.isArray(flatConfig) || !flatConfig.length || typeof flatConfig[0] !== 'object') {
  throw new Error('flat.js must export a non-empty array of flat config objects');
}

const baseDir = __dirname;
const fakeDir = path.resolve(path.join(baseDir, 'fake-files'));

// Helper: create an ESLint instance that ONLY uses our flat config
function mkCLI(opts = {}) {
  return new ESLint({
    // Do NOT load eslint.config.js from disk; use our programmatic config:
    overrideConfigFile: true,
    // ESLint v9 accepts an array for overrideConfig (flat)
    overrideConfig: flatConfig,
    ...opts
  });
}

test('sanity: referenced @stylistic/* rules exist', (t) => {
  t.plan(1);
  const rules = flatConfig[0].rules || {};
  const stylisticIds = Object.keys(rules).filter((r) => r.startsWith('@stylistic/'));
  t.ok(stylisticIds.length > 0, 'stylistic rules are present (non-empty)');
});

test('validate: flat config exports expected shape', (t) => {
  t.plan(2);
  t.ok(Array.isArray(flatConfig), 'flat.js exports an array');
  t.ok(flatConfig.length > 0 && typeof flatConfig[0] === 'object', 'first element is an object');
});

test('validate: config loads and applies with no rule crashes', async (t) => {
  // Lint a trivial file to confirm the config resolves plugins, rules, and structure.
  const cli = mkCLI();
  const [report] = await cli.lintText('/* empty test */\n', { filePath: path.join(fakeDir, 'noop.js') });

  t.plan(4);
  t.equal(report.errorCount, 0, 'report.errorCount === 0');
  t.equal(report.fixableErrorCount, 0, 'report.fixableErrorCount === 0');
  t.equal(report.warningCount, 0, 'report.warningCount === 0');
  t.equal(report.fixableWarningCount, 0, 'report.fixableWarningCount === 0');
});

test('lint: valid.js', async (t) => {
  const cli = mkCLI();
  const [report] = await cli.lintFiles([path.join(fakeDir, 'valid.js')]);

  t.plan(4);
  t.equal(report.errorCount, 0);
  t.equal(report.fixableErrorCount, 0);
  t.equal(report.warningCount, 0);
  t.equal(report.fixableWarningCount, 0);
});

test('guard: no core stylistic rule IDs present', (t) => {
  t.plan(1);
  const cfgRules = Object.keys(flatConfig[0].rules || {});
  const legacyStylistic = new Set([
    'array-bracket-spacing','arrow-parens','arrow-spacing','block-spacing',
    'brace-style','comma-dangle','comma-spacing','comma-style','dot-location',
    'eol-last','func-call-spacing','generator-star-spacing','indent','key-spacing',
    'keyword-spacing','max-statements-per-line','no-confusing-arrow','no-floating-decimal',
    'no-multi-spaces','no-multiple-empty-lines','no-trailing-spaces','object-curly-spacing',
    'operator-linebreak','padded-blocks','quotes','semi','semi-spacing',
    'space-before-blocks','space-before-function-paren','space-in-parens',
    'space-infix-ops','space-unary-ops','spaced-comment'
  ]);
  const offenders = cfgRules.filter((r) => legacyStylistic.has(r));
  t.deepEqual(offenders, [], 'all stylistic rules use @stylistic/* IDs');
});


test('lint: invalid.js (all fixable)', async (t) => {
  const cli = mkCLI();
  const [report] = await cli.lintFiles([path.join(fakeDir, 'invalid.js')]);

  t.plan(5);
  t.ok(report.errorCount > 0, 'has errors');
  t.ok(report.messages.every((m) => m.fix != null), 'all reported errors are fixable');
  t.equal(report.warningCount, 0);
  t.equal(report.fixableWarningCount, 0);
  t.equal(report.fixableErrorCount, report.errorCount, 'fixableErrorCount matches errorCount');
});

test('fix: invalid.js is auto-fixed and idempotent', async (t) => {
  const cliFix = mkCLI({ fix: true });
  const file = path.join(fakeDir, 'invalid.js');
  const expectedRaw = await fs.readFile(path.join(fakeDir, 'invalid.fixed.js'), 'utf8');
  const toLF = (s) => s.replace(/\r\n/g, '\n');
  const expected = toLF(expectedRaw);

  t.plan(6);

  const [report] = await cliFix.lintFiles([file]);
  t.ok(report.output, 'eslint produced an output for invalid.js');
  t.equal(report.errorCount, 0, 'no remaining errors after fix');
  t.equal(report.fixableErrorCount, 0, 'no remaining fixable errors');
  t.equal(report.warningCount, 0, 'no warnings');
  t.equal(toLF(report.output).trim(), expected.trim(), 'fixed output matches expected');

  const fixedAgain = await cliFix.lintText(report.output, { filePath: file });
  t.notOk(fixedAgain[0].output, 'second pass makes no further changes');
});

test('idempotent: already formatted file remains unchanged', async (t) => {
  t.plan(2);
  const cli = mkCLI({ fix: true });
  const file = path.join(fakeDir, 'invalid.fixed.js');
  const [report] = await cli.lintFiles([file]);
  t.equal(report.errorCount, 0, 'no errors on fixed file');
  t.notOk(report.output, 'no further fixes produced');
});

test('enforcement: non-fixable core rules fire (no-unused-vars / no-console / eqeqeq)', async (t) => {
  t.plan(5);
  const cli = mkCLI();
  // Preformatted to avoid stylistic fixables; only core rule violations should fire.
  const src = [
    'function f(x) {',
    '  if (x == 0) {',             // eqeqeq (non-null)
    "    console.log('x');",       // no-console (warn/error only allowed)
    '  }',
    '',
    '  return 1;',
    '}',
    ''
  ].join('\n');
  const [report] = await cli.lintText(src, { filePath: path.join(fakeDir, 'behavior.js') });
  const ids = report.messages.map((m) => m.ruleId);
  t.ok(ids.includes('no-unused-vars'), 'no-unused-vars reported');
  t.ok(ids.includes('no-console'), 'no-console reported');
  t.ok(ids.includes('eqeqeq'), 'eqeqeq reported');
  t.equal(report.fixableErrorCount, 0, 'these should not be auto-fixable');
  t.ok(report.errorCount >= 3, 'at least the three rules we test for are reported');
});

// Consumer-style test: write a CommonJS eslint.config.js and let ESLint discover it
test('consumer: extends via imported flat config', async (t) => {
  t.plan(1);

  const tmp = path.join(baseDir, '.tmp-consumer-flat');
  const cfgPath = path.join(tmp, 'eslint.config.js');
  const samplePath = path.join(tmp, 'sample.js');

  await fs.rm(tmp, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(tmp, { recursive: true });
  t.teardown(async () => { await fs.rm(tmp, { recursive: true, force: true }); });

  // Write CJS config that re-exports our flat array
  const pkgFlatAbs = path.resolve(path.join(baseDir, '..', 'flat.js')).replace(/\\/g, '/');
  await fs.writeFile(
    cfgPath,
    `module.exports = require('${pkgFlatAbs}');\n`,
    'utf8'
  );

  await fs.writeFile(samplePath, `function ok(){ return 1 }\n`, 'utf8');

  // Let ESLint auto-discover eslint.config.js in tmp
  const cli = new ESLint({ cwd: tmp }); // discovery mode
  const [report] = await cli.lintFiles(['sample.js']);

  const ruleNotFound = report.messages.some((m) =>
    /Definition for rule .* was not found/.test(m.message)
  );
  t.equal(ruleNotFound, false, 'no missing rule definitions');
});

test('consumer: ESM config can import package', async (t) => {
  t.plan(1);

  const tmp = path.join(baseDir, '.tmp-consumer-flat-esm');
  await fs.rm(tmp, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(tmp, { recursive: true });
  t.teardown(async () => { await fs.rm(tmp, { recursive: true, force: true }); });

  const pkgFlatAbs = path.resolve(path.join(baseDir, '..', 'flat.js')).replace(/\\/g, '/');

  // ESM project
  await fs.writeFile(path.join(tmp, 'package.json'), JSON.stringify({ type: 'module' }), 'utf8');

  // ESM eslint config that imports your CJS and re-exports default
  await fs.writeFile(
    path.join(tmp, 'eslint.config.mjs'),
    `
    import pkg from '${pkgFlatAbs}';
    export default (pkg && pkg.default) ? pkg.default : pkg;
    `,
    'utf8'
  );

  await fs.writeFile(path.join(tmp, 'sample.js'), `function ok(){ return 1 }\n`, 'utf8');

  const cli = new ESLint({ cwd: tmp });
  const [report] = await cli.lintFiles(['sample.js']);
  const ruleNotFound = report.messages.some(m => /Definition for rule .* was not found/.test(m.message));
  t.equal(ruleNotFound, false, 'ESM consumer loads config without rule resolution errors');
});

test('integrity: config is not mutated across ESLint runs', async (t) => {
  t.plan(1);
  const snapshot = (cfg) => JSON.stringify(
    cfg.map(({ rules, languageOptions }) => ({
      rules,
      languageOptions
    }))
  );
  const before = snapshot(flatConfig);
  await mkCLI().lintText('/* a */', { filePath: 'a.js' });
  await mkCLI().lintText('/* b */', { filePath: 'b.js' });
  const after = snapshot(flatConfig);
  t.equal(after, before, 'flatConfig remains unchanged');
});
