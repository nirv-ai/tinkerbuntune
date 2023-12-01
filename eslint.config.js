// @ts-check

// @see https://github.com/nivalis-studio/eslint-config/blob/main/src/configs/imports.ts

import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import * as tsImport from 'eslint-import-resolver-typescript';
import eslintConfigESLint from 'eslint-config-eslint';
import eslintImport from 'eslint-plugin-import';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';
import jsoncPlugin from 'eslint-plugin-jsonc';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import promisePlugin from 'eslint-plugin-promise';
import stylistic from '@stylistic/eslint-plugin';

const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts'];
const javaScriptExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
const allExtensions = [...typeScriptExtensions, ...javaScriptExtensions];

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});
// ?([cm])[jt]s?(x)
const tsFiles = ['**/*.?(*)ts?(x)'];
const jsFiles = ['**/*.?(*)js?(x)'];
const dtsFiles = ['**/*.d.?(*)ts?(x)'];
const testFiles = ['**/test/**/*.?(*){t,j}s?(x)', '**/*.test.?(*){t,j}s?(x)'];

const files = tsFiles.concat(jsFiles);

const eslintOptions = {
  linterOptions: {
    noInlineConfig: true,
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
    parser: typescriptParser,
    parserOptions: {
      cacheLifetime: {
        glob: 'Infinity',
      },
      tsconfigRootDir: __dirname,
      extraFileExtensions: allExtensions,
      sourceType: 'module',
      EXPERIMENTAL_useProjectService: true,
      ecmaVersion: 'latest',
      allowAutomaticSingleRunInference: true,
      jsDocParsingMode: 'type-info',
      ecmaFeatures: {
        jsx: true,
        globalReturn: false,
        impliedStrict: true,
      },
    },
  },
  settings: {
    'import/extensions': allExtensions,
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/cache': {
      lifetime: Infinity,
    },
    'import/resolver': {
      node: {
        extensions: javaScriptExtensions,
      },
      typescript: {
        ...tsImport,
        defaultExtensionAlias: {},
        extensions: allExtensions,
        alwaysTryTypes: true,
        conditionNames: ['bun'].concat(tsImport.conditionNames),
      },
    },
    'import/parsers': {
      // TODO: remove this line once eslint-plugin-import #2556 is fixed
      // espree: javaScriptExtensions,
      '@typescript-eslint/parser': typeScriptExtensions,
    },
  },
};

export default [
  ...eslintConfigESLint
    .map(({ files, ...rest }) =>
      rest.plugins?.jsdoc || rest.settings?.jsdoc
        ? false
        : !files || files.includes('**/*.js')
        ? rest
        : { files, ...rest }
    )
    .filter(Boolean),
  ...compat.plugins('@typescript-eslint', 'tsdoc', 'jsonc', 'promise'),
  {
    ignores: [
      '**/build/**',
      '**/docs/**',
      '**/coverage-ts/**',
      'packages/utils/types/*.d.ts',
    ],
  },
  {
    plugins: {
      '@stylistic': stylistic,
      import: eslintImport,
    },
  },
  {
    files,
    ...eslintOptions,
    rules: {
      ...eslintImport.configs.recommended.rules,
      ...eslintImport.configs.typescript.rules,
      ...promisePlugin.configs.recommended.rules,
      ...typescriptPlugin.configs['strict-type-checked'].rules,
      ...typescriptPlugin.configs['stylistic-type-checked'].rules,
      ...stylistic.configs['disable-legacy'].rules,
      ...stylistic.configs['recommended-flat'].rules,
      'import/no-unresolved': 'error',
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
          disallowTypeAnnotations: false,
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
    rules: {
      ...typescriptPlugin.configs['disable-type-checked'].rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    files: dtsFiles,
    rules: {
      'import/no-duplicates': 'off',
      'unused-imports/no-unused-vars': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
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
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.json?(*)'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      ...jsoncPlugin.configs.base.overrides[0].rules,
    },
  },
  {
    files: ['**/*.json$'],
    rules: jsoncPlugin.configs['recommended-with-json'].rules,
  },
  {
    files: ['**/*.jsonc$'],
    rules: jsoncPlugin.configs['recommended-with-jsonc'].rules,
  },
  {
    files: ['**/*.json5$'],
    rules: jsoncPlugin.configs['recommended-with-json5'].rules,
  },
];
