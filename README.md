# @alexdiliberto/eslint-config
[![Build status][gh-actions-badge]][gh-actions-url]
[![Commitizen friendly][cz-badge]][cz-cli-url]

A shareable [ESLint](https://eslint.org/) flat config containing my preferred ESLint rules.

## Requirements

* Node.js 22 or later
* ESLint 9
* `@stylistic/eslint-plugin` 5

ESLint 10 support is planned for the next major release.

## Installation

Install the config and its peer dependencies:

```bash
pnpm add --save-dev \
  @alexdiliberto/eslint-config \
  eslint@^9 \
  @stylistic/eslint-plugin@^5
```

Using npm:

```bash
npm install --save-dev \
  @alexdiliberto/eslint-config \
  eslint@^9 \
  @stylistic/eslint-plugin@^5
```

## Usage

This package uses ESLint's flat config format and replaces legacy `.eslintrc.*` configuration files.

### CommonJS

Create `eslint.config.js` in the root of your project:

```js
'use strict';

const configOrPromise = require('@alexdiliberto/eslint-config');

module.exports = (async () => {
  const config = configOrPromise?.then
    ? await configOrPromise
    : (configOrPromise?.default ?? configOrPromise);

  if (!Array.isArray(config)) {
    throw new Error('Expected flat config array');
  }

  return config;
})();
```

### ECMAScript modules

Create `eslint.config.mjs` in the root of your project:

```js
import config from '@alexdiliberto/eslint-config';

export default Array.isArray(config)
  ? config
  : (config?.default ?? config);
```

## Combining with `eslint:recommended`

Flat config does not support the legacy `"eslint:recommended"` string. Install `@eslint/js`:

```bash
pnpm add --save-dev @eslint/js
```

Then include its recommended configuration before this package so this package's rules take precedence:

```js
import js from '@eslint/js';
import config from '@alexdiliberto/eslint-config';

export default [
  js.configs.recommended,
  ...config,
];
```

Additional flat configurations can be inserted before this package:

```js
import js from '@eslint/js';
import config from '@alexdiliberto/eslint-config';
import anotherConfig from 'another-eslint-config';

export default [
  js.configs.recommended,
  ...anotherConfig,
  ...config,
];
```

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

`release-it` will run the tests, update the version and changelog, publish to npm, create and push the Git tag, and create the GitHub release.

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
