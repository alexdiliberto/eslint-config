module.exports = {
  rules: {
    'array-bracket-spacing': ['error', 'never'],

    'array-callback-return': 'error',

    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: true,
    }],

    'arrow-parens': ['error', 'always'],

    'arrow-spacing': ['error', {
      before: true,
      after: true
    }],

    'brace-style': ['error', '1tbs', {
      allowSingleLine: false
    }],

    'camelcase': ['error', {
      properties: 'always'
    }],

    'consistent-return': 'error',

    'comma-dangle': ['error', 'never'],

    'comma-spacing': ['error', {
      before: false,
      after: true
    }],

    'comma-style': ['error', 'last'],

    'complexity': ['error', {
      'max': 11
    }],

    'curly': ['error', 'all'],

    'dot-notation': ['error', {
      allowKeywords: true
    }],

    'dot-location': ['error', 'property'],

    'eqeqeq': ['error', 'always', {
      null: 'ignore'
    }],

    'func-call-spacing': ['error', 'never'],

    'guard-for-in': 'error',

    'generator-star-spacing': ['error', 'both'],

    'indent': ['error', 2, {
      SwitchCase: 1
    }],

    'key-spacing': ['error', {
      beforeColon: false,
      afterColon: true,
      mode: 'minimum'
    }],

    'keyword-spacing': ['error', {
      before: true,
      after: true
    }],

    'max-statements-per-line': ['error', {
      max: 1
    }],

    'new-cap': ['error', {
      // Capital variables that can be used without `new`
      'capIsNewExceptions': [
        'A' // Ember.A
      ]
    }],

    'no-alert': 'warn',

    'no-array-constructor': 'error',

    'no-caller': 'error',

    'no-confusing-arrow': ['error', {
      allowParens: false
    }],

    'no-console': ['error', {
      allow: ['warn', 'error']
    }],

    'no-dupe-class-members': 'error',

    'no-empty': 'error',

    'no-eval': 'error',

    'no-floating-decimal': 'error',

    'no-implied-eval': 'error',

    'no-iterator': 'error',

    'no-loop-func': 'error',

    'no-lone-blocks': 'error',

    'no-multi-spaces': 'error',

    'no-multiple-empty-lines': ['error', {
      max: 1
    }],

    'no-new-func': 'error',

    'no-new-wrappers': 'error',

    'no-octal-escape': 'error',

    'no-plusplus': 'error',

    'no-proto': 'error',

    'no-script-url': 'error',

    'no-trailing-spaces': ['error', {
      ignoreComments: true
    }],

    'no-unneeded-ternary': ['error', {
      defaultAssignment: false
    }],

    'no-useless-concat': 'error',

    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'none',
      ignoreRestSiblings: true
    }],

    'no-var': 'error',

    'no-void': 'error',

    'no-with': 'error',

    'object-curly-spacing': ['error', 'always'],

    'object-shorthand': ['error', 'always'],

    'one-var': ['error', 'never'],

    'operator-linebreak': ['error', 'after'],

    'prefer-spread': 'error',

    'prefer-template': 'error',

    'quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true
    }],

    'radix': 'error',

    'semi': ['error', 'always'],

    'semi-spacing': ['error', {
      before: false,
      after: true
    }],

    'space-before-blocks': ['error', 'always'],

    'space-before-function-paren': ['error', 'never'],

    'space-in-parens': ['error', 'never'],

    'space-infix-ops': 'error',

    'space-unary-ops': ['error', {
      words: true,
      nonwords: false
    }],

    'spaced-comment': ['error', 'always', {
      block: {
        balanced: true
      }
    }],

    'yoda': 'error'
  }
};
