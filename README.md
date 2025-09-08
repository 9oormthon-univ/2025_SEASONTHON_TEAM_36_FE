<div align="center">

## [2025 kakao x goorm] 시즌톤 36팀 - 우물 밖 연구소

#### 우물 안 개구리들이 모두 밖으로 탈출하는 그 날까지

### 우물 밖 개구리 🐸

<img width="1212" height="682" alt="스크린샷 2025-09-08 오후 8 16 20" src="https://github.com/user-attachments/assets/492dfb93-5c97-4a2d-91fa-094c59c83b27" />

 

**"하나의 큰 과제를 실행 가능한 과제로 세분화하여 무기력, 우울감, 번아웃을 느끼는 사람들의 회복을 돕는**
<br />
**자기효능감 회복 투두리스트 서비스"**

</div>

---
## 서비스 배경

- 대학생 중 적게는 50%, 많게는 70~95%가 해야 하는 일들을 미루는 행동, 즉 지연 행동을 경험
- 지연 행동의 원인은 게으름의 문제가 아닌 심리적인 문제이며 우울감, 낮은 자기효능감, 불안, 두려움, 완벽주의, 실패에 대한 두려움, 무기력함 등으로 인해 발생
- 지연 행동은 큰 재정적 손실과 건강 상태를 악화시킴
- 전문가들은 여러 해결책 중 하나의 큰 과제를 여러 단계로 분해하는 것을 제안
## 문제 해결 목표

**본 해커톤에서 AI로 큰 과업을 작은 단계로 분할하고, 미뤘던 과제를 사용자에게 재시도 할 수 있는 기회를 제공하여 사용자의 자기효능감을 회복시켜주는 투두리스트 서비스를 개발하기로 함**

## 주요 기능

#### 1. 스플래시 화면 및 카카오 소셜 로그인

#### 2. 홈 화면

- 1개 이상의 큰 과업에서 오늘 해야 할 과제 확인
- 완료한 과제의 수에 따라 우물 안 개구리가 올라가는 UI 적용
- 과제 시작 • 중지 • 종료 버튼
- 하루에 수행 가능한 과제 중 첫 과제를 시작 전에 자신의 감정을 확인

#### 3. 캘린더

- 그 날에 해야 되는 과제 조회
- 과제를 달성할 때마다 과제를 달성한 날짜의 색상 명도가 진해짐
- 새로운 과업을 추가
- 과제를 수정하거나 삭제

#### 4. 다이어리

- 별자리 기반의 그 날의 감정 일기 조회 및 작성

#### 5. 프로필

- 사용자의 주간 • 월간 업무 데이터 통계 대시보드 확인

## FE 개발 스택

<img width="436" height="464" alt="스크린샷 2025-09-08 오후 10 58 12" src="https://github.com/user-attachments/assets/1e70504e-5299-44c3-b39f-025ab20bf756" />

## FE 개발 컨벤션

### 1. Git Branch 관리

GitHub Flow 전략

<img width="1149" height="558" alt="스크린샷 2025-08-28 오후 9 52 00" src="https://github.com/user-attachments/assets/9b7ff886-26a9-469f-8173-cadf8e3a7826" />

### 2. 커밋 컨벤션

| 태그 |	설명 |
| --- | --- |
| feat | 새로운 기능 추가 |
| init | 프로젝트 초기 세팅 |
| fix | 버그 수정 |
| style | UI/UX 변경 |
| refactor | 코드 포맷 (기능 변경 없음), 코드 구조 개선 |
| comment | 주석 처리 |
| docs | 프로젝트 문서(README.md, .github의 PR, ISSUE 템플릿 등) |
| test | 테스트 코드 추가/수정 |
| chore | 번들/패키지 설치, 빌드 설정 |
| rename | 파일/폴더명 변경 |
| remove | 파일/폴더명 삭제 |
| asset | 로고, 아이콘, 폰트, 비디오, 오디오 등의 멀티미디어 추가 |
| ci | CI/CD 설정 변경 |
| perf | 성능 최적화 |
| revert | 이전 커밋 되돌리기 |

### 3. 폴더 구조

```
node_modules
public
src
|
|_ apis
|  ├─ index.js
│  ├─ map.js
│  ├─ marker.js
│  ├─ centerMarker.js
│  └─ user.js
|
|_ assets
|  |_ images
|  |_ fonts
|
|_ layout
|
|_ pages
|  |_ (page)
|     |_ store
|     |_ utils
|     |_ components
|     |_ styles
|     |_ index.tsx
|
|_ common
|  |_ store
|  |_ utils
|  |_ components
|  |_ styles
|
|_ App.tsx
|_ index.css
|_ main.tsx
.env
.gitignore
.prettierrc
eslint.config.js
index.html
package-lock.json
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.js
```

### 4. 코드 포맷팅

(1) .prettierrc

```
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "semi": true,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSameLine": false
}
```

(2) eslint.config.js

```
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
```
