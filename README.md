# @alexdiliberto/eslint-config
[![Build status][gh-actions-badge]][gh-actions-url]
[![Commitizen friendly][cz-badge]][cz-cli-url]

A [shareable ESLint config](https://eslint.org/docs/developer-guide/shareable-configs.html) containing all of my preferred eslint rules.


## Installation
```bash
pnpm add -D @alexdiliberto/eslint-config
```

OR

```bash
npm install --save-dev @alexdiliberto/eslint-config
```

This package exports a **Flat Config** for ESLint v9+.

Install peer dependencies:

```bash
pnpm add -D eslint @stylistic/eslint-plugin
```


## Usage (ESLint v9 Flat Config)

### CommonJS

Create `eslint.config.js` in the root of your project:

```js
'use strict';
const cfgOrPromise = require('@alexdiliberto/eslint-config');

module.exports = (async () => {
  const cfg = (cfgOrPromise?.then ? await cfgOrPromise : (cfgOrPromise?.default ?? cfgOrPromise));
  if (!Array.isArray(cfg)) throw new Error('Expected flat config array');
  return cfg;
})();
```

### ECMAScript Modules

Create `eslint.config.mjs` in the root of your project:

```js
import cfg from '@alexdiliberto/eslint-config';

export default (Array.isArray(cfg) ? cfg : (cfg?.default ?? cfg));
```

**Notes:**
- This config replaces `.eslintrc.*` and works with ESLint’s new Flat Config format.
- Requiring async support (via `await`) allows future extensibility, e.g. dynamic imports or file systems reads.
- Valid for both Node ≥20.9 and in ESM environments.

### Using with `eslint:recommended`

You can extend both rule sets, making sure to include this config last:

```js
export default [
  {
    extends: ['eslint:recommended'],
  },
  ...yourOtherConfigs,
  ...require('@alexdiliberto/eslint-config')
];
```


## Release
Releases are automated using [`release-it`](https://github.com/release-it/release-it). To publish a new version:

```js
pnpm release
```

## License
MIT Copyright (c) [Alex DiLiberto](https://alexdiliberto.com/)


[gh-actions-badge]: https://github.com/alexdiliberto/eslint-config/actions/workflows/ci.yml/badge.svg
[gh-actions-url]: https://github.com/alexdiliberto/eslint-config/actions/workflows/ci.yml
[cz-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[cz-cli-url]: https://commitizen.github.io/cz-cli/