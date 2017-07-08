# @alexdiliberto/eslint-config
Alex DiLiberto's preferred ESLint rules

### Installation
```bash
npm install  --save-dev @alexdiliberto/eslint-config
```

Next, install all necessary peer dependencies as notified via console after running the above command.

### Usage
Add `@alexdiliberto` to the `extends` array in your project's `.eslintrc.js` file [as a shorthand](http://eslint.org/docs/developer-guide/shareable-configs#npm-scoped-modules) and these sharable config rules will be automatically consumed by ESLint from within your project:

```js
extends: [
  // ... possibly some other rules here
  '@alexdiliberto'
]
```

Now you can simply run `eslint` on from your project utilizing all of the provided rules from this shared config
