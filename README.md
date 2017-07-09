# @alexdiliberto/eslint-config [![build status][travis-badge]][travis-url]
[Shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for all of my preferred ESLint rules.

## Installation
```bash
npm install  --save-dev @alexdiliberto/eslint-config
```

Next, install all necessary peer dependencies as notified via console after running the above command.

## Usage
Add `@alexdiliberto` to the `extends` array in your project's `.eslintrc.js` file [as a shorthand](http://eslint.org/docs/developer-guide/shareable-configs#npm-scoped-modules) and these sharable config rules will be automatically consumed by ESLint from within your project.

```js
{
  extends: ['@alexdiliberto']
}
```

### Using the `@alexdiliberto/eslint-config` config with `eslint:recommended`

To use this config in conjunction with [ESLint's core `eslint:recommended` ruleset](http://eslint.org/docs/rules/), extend them both, making sure to list `@alexdiliberto` last. Please note that I have made it a priority to not override any of ESLint's recommended rules -- this serves only as a precautionary measure to ensure overrides.

```js
{
  extends: [
    'eslint:recommended',
    '@alexdiliberto'
  ]
}
```

## License
MIT Copyright (c) [Alex DiLiberto](https://alexdiliberto.com/)


[travis-badge]: https://travis-ci.org/alexdiliberto/eslint-config.svg?branch=master
[travis-url]: hhttps://travis-ci.org/alexdiliberto/eslint-config
