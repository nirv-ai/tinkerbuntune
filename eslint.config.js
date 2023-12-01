// @see https://github.com/nivalis-studio/eslint-config/blob/main/src/configs/imports.ts
// @see https://github.com/antfu/eslint-config

import * as importResolverTypescript from 'eslint-import-resolver-typescript'
import globals from 'globals'
import jsoncParser from 'jsonc-eslint-parser'
import typescriptParser from '@typescript-eslint/parser'

import eslintImport from 'eslint-plugin-import'
import jsoncPlugin from 'eslint-plugin-jsonc'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import promisePlugin from 'eslint-plugin-promise'
import * as stylistic from '@stylistic/eslint-plugin'
import commentsPlugin from 'eslint-plugin-eslint-comments'
import tsdocPlugin from 'eslint-plugin-tsdoc'
import unicornPlugin from 'eslint-plugin-unicorn'
import jsPlugin from '@eslint/js'

const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts']
const javaScriptExtensions = ['.js', '.jsx', '.mjs', '.cjs', '.json', 'node']
const allExtensions = [...typeScriptExtensions, ...javaScriptExtensions]

const tsFiles = ['**/*.?(*)ts?(x)']
const jsFiles = ['**/*.?(*)js?(x)']
const dtsFiles = ['**/*.d.?(*)ts?(x)']
const testFiles = ['**/test/**/*.?(*){t,j}s?(x)', '**/*.test.?(*){t,j}s?(x)']
const jsonFiles = ['**/*.json?(*)']
const cjsFiles = ['**/*.cjs']

const eslintOptions = (language = {}, settings = {}) => ({
  linterOptions: {
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals['shared-node-browser'],
    },
    sourceType: 'module',
    parser: typescriptParser,
    parserOptions: {
      cacheLifetime: {
        glob: 'Infinity',
      },
      tsconfigRootDir: import.meta.dir,
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
    ...language,
  },
  settings,
})

const tsOptions = eslintOptions(
  {},
  {
    'import/extensions': allExtensions,
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/cache': {
      lifetime: Number.POSITIVE_INFINITY,
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        extensions: allExtensions,
        extensionAlias: importResolverTypescript.defaultExtensionAlias,
        conditionNames: ['bun', ...importResolverTypescript.defaultConditionNames],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': typeScriptExtensions,
    },
  },
)

export default [
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
      'import': eslintImport,
      '@typescript-eslint': typescriptPlugin,
      'promise': promisePlugin,
      'jsonc': jsoncPlugin,
      'tsdoc': tsdocPlugin,
      'eslint-comments': commentsPlugin,
      'unicorn': unicornPlugin,
    },
  },
  {
    files: [...tsFiles, ...jsFiles],
    ...tsOptions,
    rules: {
      ...eslintImport.configs.recommended.rules,
      ...eslintImport.configs.typescript.rules,
      ...promisePlugin.configs.recommended.rules,
      ...unicornPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs['strict-type-checked'].rules,
      ...typescriptPlugin.configs['stylistic-type-checked'].rules,
      ...stylistic.configs['disable-legacy'].rules,
      ...stylistic.configs['recommended-flat'].rules,
      'tsdoc/syntax': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'import/no-unresolved': ['error', { ignore: ['^bun:*'] }],
      'new-cap': 'off',
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'eslint-comments/no-unused-disable': 'error',
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
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: true },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
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
          'minimumDescriptionLength': 5,
        },
      ],
      'n/no-missing-import': 'off', // hella buggy
      'n/no-extraneous-import': 'off', // hella buggy
      'import/no-named-as-default-member': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/consistent-destructuring': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: jsFiles,
    rules: {
      ...typescriptPlugin.configs['disable-type-checked'].rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      ...jsPlugin.configs.recommended.rules,
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
    files: cjsFiles,
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: jsonFiles,
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
]
