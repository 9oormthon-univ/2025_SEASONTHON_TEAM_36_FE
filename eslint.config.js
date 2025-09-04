import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  // 전역 무시 설정
  {
    ignores: ['dist/**/*', 'build/**/*', 'node_modules/**/*'],
  },

  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // 메인 설정
  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },

    rules: {
      // React Hooks 권장 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh 관련
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import 정렬 및 관리
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',

      // Console 관련
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // 변수 및 코드 품질
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-undef': 'error',

      // 포맷팅 관련
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'error',
    },
  },
];
