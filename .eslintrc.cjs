// .eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist/', 'coverage/', 'test/fake-files/**']
};
