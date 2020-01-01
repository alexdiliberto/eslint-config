# @alexdiliberto/eslint-config
[![Build status][travis-badge]][travis-url]
[![Commitizen friendly][cz-badge]][cz-cli-url]

[Shareable config](https://eslint.org/docs/developer-guide/shareable-configs.html) for all of my preferred ESLint rules.

## Installation
```bash
yarn add -D @alexdiliberto/eslint-config
```

OR

```bash
npm install --save-dev @alexdiliberto/eslint-config
```

Next, install all necessary peer dependencies as notified via console after running the above command.

Alternatively, if you are using this eslint-config with an Ember CLI project -- simply ensure that the [`ember-cli-eslint`](https://github.com/ember-cli/ember-cli-eslint) addon is installed with version [`>= v5.0.0`](https://github.com/ember-cli/ember-cli-eslint/releases/tag/v5.0.0) and that will take care of the necessary peer dependencies for you automatically.

## Usage
Add `@alexdiliberto` to the `extends` array in your project's `.eslintrc.js` file [as a shorthand](https://eslint.org/docs/developer-guide/shareable-configs#npm-scoped-modules) and these sharable config rules will be automatically consumed by ESLint from within your project.

```js
{
  extends: ['@alexdiliberto']
}
```

### Using the `@alexdiliberto/eslint-config` config with `eslint:recommended`

To use this config in conjunction with [ESLint's core `eslint:recommended` ruleset](https://eslint.org/docs/rules/), extend them both, making sure to list `@alexdiliberto` last. Please note that I have made it a priority to try not override any of ESLint's recommended rules unless explicitly noted in comments -- this serves only as a precautionary measure to ensure overrides.

```js
{
  extends: [
    'eslint:recommended',
    '@alexdiliberto'
  ]
}
```

## Deploy
Due to an issue with `yarn` and `np`, simply use `npm` when running the `deploy` script

```js
npm run deploy
```

## License
MIT Copyright (c) [Alex DiLiberto](https://alexdiliberto.com/)


[travis-badge]: https://travis-ci.org/alexdiliberto/eslint-config.svg?branch=master
[travis-url]: https://travis-ci.org/alexdiliberto/eslint-config
[cz-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[cz-cli-url]: https://commitizen.github.io/cz-cli/
