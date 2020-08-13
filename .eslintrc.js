'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
  ],
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      env: {
        node: true
      }
    },
    {
      files: ['public/js/scrolling-nav.js'],
      globals: {
        jQuery: 'readonly'
      }
    }
  ],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'prefer-const': ['error'],
    'no-var': ['error'],
    'prefer-destructuring': ['error'],
    'object-shorthand': ['error'],
    'object-curly-spacing': ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
    'brace-style': ['error', '1tbs'],
    'prefer-template': ['error'],
    'space-infix-ops': ['error'],
    'template-curly-spacing': ['error', 'never']
  }
};
