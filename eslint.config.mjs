import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('prettier'),
  {
    rules: {
      'react/prop-types': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: [
      // Next.js build output
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',

      // Dependencies
      'node_modules/**',
      '.pnp',
      '.pnp.js',

      // Testing
      'coverage/**',

      // Misc
      '.DS_Store',
      '*.pem',

      // Debug logs
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // Vercel
      '.vercel/**',

      // Lock files
      'yarn.lock',
      'pnpm-lock.yaml',
      'package-lock.json',

      // Config files
      '.prettierignore',
      '.gitignore',
      '.all-contributorsrc',

      // Public assets
      'public/**',
    ],
  },
];

export default eslintConfig;
