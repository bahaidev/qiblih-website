'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
  ],
  env: {
    browser: true,
    es6: true
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
  rules: {}
};
