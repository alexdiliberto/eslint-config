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

Then install the required ESLint peer dependency if you don’t already have it:

```bash
pnpm add -D eslint
```

Note: For Ember projects using [`ember-cli-eslint v5.0.0`](https://github.com/ember-cli/ember-cli-eslint/releases/tag/v5.0.0) or later, peer dependencies are handled for you.

## Usage
Add `@alexdiliberto` to the `extends` array in your project's `.eslintrc.js` file [as a shorthand](https://eslint.org/docs/developer-guide/shareable-configs#npm-scoped-modules) and these sharable config rules will be automatically consumed by ESLint from within your project.

```js
{
  extends: ['@alexdiliberto']
}
```

### Using with `eslint:recommended`

To use this config with [ESLint's core `eslint:recommended` ruleset](https://eslint.org/docs/rules/), extend them both, making sure to list `@alexdiliberto` last to override where necessary. 
```js
{
  extends: [
    'eslint:recommended',
    '@alexdiliberto'
  ]
}
```

Note: I have prioritized not override any of ESLint's recommended rules unless explicitly noted in comments.

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