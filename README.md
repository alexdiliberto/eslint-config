# @alexdiliberto/eslint-config
[![Build status][gh-actions-badge]][gh-actions-url]
[![Commitizen friendly][cz-badge]][cz-cli-url]

A shareable [ESLint](https://eslint.org/) flat config containing my preferred ESLint rules.

## Requirements

* Node.js 22 or later
* ESLint 10

## Installation

Install the config and its peer dependencies:

```bash
pnpm add --save-dev \
  @alexdiliberto/eslint-config \
  eslint@^10
```

Using npm:

```bash
npm install --save-dev \
  @alexdiliberto/eslint-config \
  eslint@^10
```

The package includes `@eslint/js` and `@stylistic/eslint-plugin`, so consumers do not install them separately.

## Usage

This package uses ESLint's flat config format and replaces legacy `.eslintrc.*` configuration files.

### CommonJS

Create `eslint.config.js` in the root of your project:

```js
'use strict';

module.exports = require('@alexdiliberto/eslint-config');
```

### ECMAScript modules

Create `eslint.config.mjs` in the root of your project:

```js
import config from '@alexdiliberto/eslint-config';

export default config;
```

## What is included

The exported array includes:

* ESLint's recommended JavaScript rules
* the package's opinionated correctness and maintainability rules
* formatting rules provided by ESLint Stylistic
* errors for unused disable directives and unused inline configuration comments

The config follows ESLint 10's default JavaScript language behavior. It does not force every file to be parsed as a classic script, so ECMAScript modules work without an additional override.

## Customization

Append project-specific configuration after this package so it takes precedence:

```js
import config from '@alexdiliberto/eslint-config';

export default [
  ...config,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
```

Other shareable flat configs can be inserted before or after this package depending on the desired precedence:

```js
import config from '@alexdiliberto/eslint-config';
import anotherConfig from 'another-eslint-config';

export default [
  ...anotherConfig,
  ...config,
];
```

### Runtime globals

The config does not assume a browser or Node.js runtime. Because the recommended baseline enables `no-undef`, declare the globals used by your project. For example:

```bash
pnpm add --save-dev globals
```

```js
import config from '@alexdiliberto/eslint-config';
import globals from 'globals';

export default [
  ...config,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];
```

Use `globals.node` for Node.js projects, or combine global sets when the project targets multiple runtimes.

## Migrating from version 8

Version 9 is a breaking release with these changes:

* ESLint 10 is required. ESLint 9 is no longer supported.
* ESLint's recommended rules are included automatically. Remove any duplicate `@eslint/js` recommended entry from your project config.
* Runtime globals must be declared explicitly when a project uses browser or Node.js globals.
* `@stylistic/eslint-plugin` is now an internal dependency. Remove it from your project unless another config uses it directly.
* JavaScript files are no longer forced to `sourceType: 'script'`. Add a project override only when classic script parsing is required.
* The deprecated core `handle-callback-err` rule has been removed.
* The deprecated core `padding-line-between-statements` rule has moved to its maintained ESLint Stylistic replacement with the same options.

## Release

Releases are automated using [`release-it`](https://github.com/release-it/release-it).

### 1. Prepare the repository

Update `main` and confirm the working tree is clean:

```bash
git switch main
git pull --ff-only origin main
git status
```

Confirm the current package version and Git tag:

```bash
node -p "require('./package.json').version"
git describe --tags --abbrev=0
```

### 2. Create a temporary npm token

Create a short-lived [granular npm access token](https://www.npmjs.com/settings/alexdiliberto/tokens/) with:

* Name: `eslint-config-release`
* Expiration: as short as practical
* Package access: `@alexdiliberto/eslint-config`
* Permission: Read and write
* Bypass 2FA: Enabled

Do not print or commit the token.

Load it into an isolated temporary npm configuration:

```bash
read -rsp "NPM token: " NPM_TOKEN
echo

export NPM_CONFIG_USERCONFIG="$(mktemp)"

printf '//registry.npmjs.org/:_authToken=%s\n' "$NPM_TOKEN" \
  > "$NPM_CONFIG_USERCONFIG"

chmod 600 "$NPM_CONFIG_USERCONFIG"
```

Verify npm access:

```bash
npm whoami
npm access list collaborators --json @alexdiliberto/eslint-config
npm view @alexdiliberto/eslint-config version
```

### 3. Configure GitHub authentication

Confirm GitHub CLI authentication:

```bash
gh auth status
```

Expose the GitHub CLI token to `release-it` without printing it:

```bash
export GITHUB_TOKEN="$(gh auth token)"
```

### 4. Preview and publish the release

Choose the appropriate semantic-version bump:

```bash
pnpm exec release-it patch --dry-run
```

Run the actual release after reviewing the proposed version and changelog:

```bash
pnpm release patch
```

Replace `patch` with `minor` or `major` when appropriate.

`release-it` will run linting and tests, update the version and changelog, publish to npm, create and push the Git tag, and create the GitHub release.

### 5. Verify the release

```bash
npm view @alexdiliberto/eslint-config version

git fetch --tags
git describe --tags --abbrev=0
git status

gh release view "v$(node -p "require('./package.json').version")"
```

### 6. Remove temporary credentials

```bash
rm -f "$NPM_CONFIG_USERCONFIG"

unset NPM_CONFIG_USERCONFIG
unset NPM_TOKEN
unset GITHUB_TOKEN
```

Delete the temporary granular token from npm after verifying the release.

## License

MIT © [Alex DiLiberto](https://alexdiliberto.com/)

[gh-actions-badge]: https://github.com/alexdiliberto/eslint-config/actions/workflows/ci.yml/badge.svg
[gh-actions-url]: https://github.com/alexdiliberto/eslint-config/actions/workflows/ci.yml
[cz-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[cz-cli-url]: https://commitizen.github.io/cz-cli/
