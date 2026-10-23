import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['public/js/qiblih.js', 'public/assets']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
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
  },
  {
    files: ['eslint.config.mjs', 'vite.config.mjs', 'image-processing.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['public/js/scrolling-nav.js'],
    languageOptions: {
      globals: {
        jQuery: 'readonly'
      }
    }
  }
]
