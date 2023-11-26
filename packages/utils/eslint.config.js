/* eslint-env node */
import parser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import eslintConfigESLint from 'eslint-config-eslint';
import stylistic from '@stylistic/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const tsFiles = ['src/**/*.*ts*'];
const jsFiles = ['src/**/*.*js*'];
const testFiles = ['src/test/**/*.*ts*', 'src/**/*.test.*ts*'];

const files = tsFiles.concat(jsFiles);

export default [
  {
    files,
  },
  {
    ignores: ['build/*', 'docs/*', 'types/*'],
  },
  {
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals['shared-node-browser'],
      },
      parser,
      parserOptions: {
        sourceType: 'module',
        EXPERIMENTAL_useProjectService: true,
        ecmaVersion: 'latest',
        allowAutomaticSingleRunInference: true,
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  ...compat.plugins('@typescript-eslint', 'eslint-plugin-tsdoc'),
  ...eslintConfigESLint
    .map(({ files, ...rest }) =>
      rest.plugins?.jsdoc || rest.settings?.jsdoc
        ? false
        : !files || files.includes('**/*.js')
        ? rest
        : { files, ...rest }
    )
    .filter(Boolean),
  {
    rules: tseslint.configs['strict-type-checked'].rules,
  },
  {
    rules: tseslint.configs['stylistic-type-checked'].rules,
  },
  stylistic.configs['disable-legacy'],
  stylistic.configs['recommended-flat'],
  {
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],
      'eslint-comments/require-description': [
        'error',
        {
          ignore: [
            'eslint-disable-next-line',
            'eslint-disable-line',
            'eslint-env',
            'global',
            'globals',
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: true },
      ],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'new-cap': 'off',
      'no-underscore-dangle': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'eslint-comments/no-unused-disable': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 5,
        },
      ],
      'n/no-missing-import': 'off', // hella buggy
      'n/no-extraneous-import': 'off', // hella buggy
    },
  },
  {
    files: jsFiles,
    languageOptions: {
      parserOptions: tseslint.configs['disable-type-checked'].parserOptions,
    },
    rules: {
      ...tseslint.configs['disable-type-checked'].rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'func-style': 'off',
      'no-console': 'off',
      'no-var': 'off',
    },
  },
];
