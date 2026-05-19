import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from 'typescript-eslint';

export default [
  // Base configuration files matching
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  },
  
  // TypeScript setup
  ...typescriptEslint.configs.recommended,
  
  // React setup
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TS instead
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // Astro setup
  ...eslintPluginAstro.configs.recommended,
  
  // Global ignore patterns
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**'],
  },
];
