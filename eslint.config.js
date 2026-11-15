const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  {
    ignores: ['.next/**', 'out/**', 'public/**', 'coverage/**', 'build/**', '.vercel/**', '.netlify/**'],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  ...nextCoreWebVitals,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React Compiler rules added by eslint-config-next 16 that flag existing
      // components; keep the previous rule set instead of refactoring them
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  prettierConfig,
];
