<div align="center">

## [2025 kakao x goorm] 우물 밖 연구소 - 시즌톤 36팀

#### 우물 안 개구리들이 모두 밖으로 탈출하는 그 날까지

### 우물 밖 개구리 🐸

<img width="1212" height="682" alt="스크린샷 2025-11-19 오전 10 27 52" src="https://github.com/user-attachments/assets/e4a9acc2-da1b-489b-8db9-f3db8df63355" />

### 

**"중•고등학생 대상 과업 세분화를 통해 작은 성공의 경험과 긍정적인 감정을 심어주는**
<br />
**감정기반 학습 도우미 서비스"**

</div>

---
## 서비스 배경

- 2024년 기준, **국내 청소년이 고민하는 문제 1위는 공부**
- 지난 10년간 **중•고등학생 기초학력미달자** **약 3배 증가**
- **공부에 장애물이 되는 요인**은 ‘의지의 문제’가 아닌 불안과 자신감 부족과 같은 **‘부정적인 감정’**

## 서비스 목표

학업 계획 수립에 어려움을 겪고 부정적 정서로 인해 수행을 주저하는 중•고등학생을 위해 **과업 세분화**로 **즉각적인 성공 경험**을 제공함으로써 **작은 성취를 습관화**하고, 과업 수행 전과 후의 **자신의 감정을 확인**함으로써 **부정적 인식을 긍정적 자기효능감으로 전환**하는 **학습 도우미 서비스**를 개발

## 주요 기능

#### 1. 온보딩 UI

- Rana(개구리 캐릭터)의 서비스 이용 안내 화면

#### 2. 홈 화면

- 과업별 오늘의 할 일(오늘의 한 걸음)과 놓쳤던 일(놓친 한 걸음)을 확인
- 할 일을 시작하거나 종료. 정지도 가능
- 할 일을 시작하기 전, 자신의 감정과 에너지를 점검하는 체크인 모달
- 과업의 수행 기간을 재조정할 수 있는 '재도약하기' 기능

#### 3. 챗봇

- 중고등학생 눈높이에 맞는 자연스러운 대화로 과업 생성을 도와주는 챗봇
- 과업 세분화로 생성된 할 일들의 예시(Tip)를 제공

#### 4. 캘린더

- 날짜별 과업과 단계 수행 상태를 조회

#### 5. 다이어리

- 별자리에서 감정 일기가 작성된 날은 해당 별을 감정과 어울리는 색으로 표현
- 별자리에서 감정 일기가 작성되지 않은 날은 해당 별을 흰색으로 표현

#### 6. 통계

- 사용자의 월별 주간 통계 대시보드 확인

## FE 기술 스택

<img width="436" height="464" alt="스크린샷 2025-09-08 오후 10 58 12" src="https://github.com/user-attachments/assets/1e70504e-5299-44c3-b39f-025ab20bf756" />

<img width="436" height="464" alt="스크린샷 2025-11-27 오전 11 21 52" src="https://github.com/user-attachments/assets/3805cb57-15c5-4a17-9978-76756abbfd9e" />


## FE 개발 컨벤션

### 1. Git Branch 관리

**GitHub Flow 전략**

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
|  |_ index.js
│  |_ (API Tag).js
|
|_ assets
|  |_ images
|  |_ fonts
|
|_ common
|  |_ components
|  |_ hooks
|  |_ styles
|  |_ types
|  |_ utils
|
|_ layout
|
|_ pages
|  |_ (page)
|     |_ components
|     |_ constants
|     |_ hooks
|     |_ store
|     |_ styles
|     |_ types
|     |_ utils
|     |_ index.tsx
|
|_ App.tsx
|_ index.css
|_ main.tsx
.env
.gitignore
.prettierrc
eslint.config.js
index.html
manifest.json
package-lock.json
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vercel.json
vite.config.ts
```

### 4. 코드 포맷팅

**(1) .prettierrc**

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

**(2) eslint.config.js**

**의존성 패키지**

- "eslint": "^9.33.0"
- "eslint-config-prettier": "^10.1.8"
- "eslint-import-resolver-alias": "^1.1.2"
- "eslint-import-resolver-typescript": "^4.4.4"
- "eslint-plugin-import": "^2.32.0"
- "eslint-plugin-prettier": "^5.5.4"
- "eslint-plugin-react-hooks": "^5.2.0"
- "eslint-plugin-react-refresh": "^0.4.20"
- "eslint-plugin-simple-import-sort": "^12.1.1"

**eslint.config.js 설정**

```javascript
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import prettier from "prettier";
import tseslint from "typescript-eslint";

const prettierConfig = await prettier.resolveConfig(process.cwd());

export default [
  // 전역 무시 설정
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },

  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // TypeScript 권장 규칙 + Parser 적용 (모든 파일 대상 기본값)
  ...tseslint.configs.recommendedTypeChecked, // 타입정보 필요 규칙(프로젝트 인식)
  {
    languageOptions: {
      // TS Parser + 프로젝트 파일 지정
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node, // Node.js 전역 변수 추가
      },
    },
  },

  // 메인 룰셋 (JS/TS/JSX/TSX 공통)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      // typescript-eslint 플러그인은 tseslint.configs에서 이미 로드됨
      prettier: prettierPlugin,
    },

    settings: {
      // import 리졸버: TS(paths), Node, 별칭(@)
      "import/resolver": {
        typescript: {
          // tsconfig의 paths/baseUrl을 읽어 경로 해석
          project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".json"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".json"],
        },
      },
    },

    rules: {
      // React Hooks 권장 규칙
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh 관련
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Import 정렬 및 관리
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",

      // Console 관련
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // 변수 및 코드 품질
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-trailing-spaces": "error",

      // .prettierrc 파일 기반 Prettier 반영
      "prettier/prettier": ["error", { ...(prettierConfig || {}), endOfLine: "auto" }],
    },
  },

  // JS 전용(비-TS) 파일에서의 규칙
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      // JS에서는 원래 규칙 사용
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "error",
    },
  },

  // TS 전용 파일에서의 규칙 조정
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TS가 대체하므로 끔
      "no-unused-vars": "off",
      "no-undef": "off",

      // TS 버전의 unused-vars 활성화
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // 선택: any 최소화(필요 시 완화 가능)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
```

### 5. 타입스크립트 설정

**- tsconfig.json**

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

**- tsconfig.app.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": { "@/*": ["*"] },
    "types": ["vite/client"],
    "noEmit": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "isolatedModules": true
  },
  "include": ["src", "src/common/types", "src/svg.d.ts"],
  "exclude": ["dist", "node_modules"]
}
```

**- tsconfig.node.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "types": ["node"],
  },
  "include": ["vite.config.ts", "eslint.config.js"]
}
```

### 6. vite 설정

**vite.config.ts**

```typescript
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
});
```

### 7. vercel 설정

- rewrites: SPA 라우팅(프론트엔드 라우터 지원)
- headers: 특정 파일 경로별 Cache-Control 헤더 적용

**vercel.json**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/splash/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/icons/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/manifest.json",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }]
    },
    {
      "source": "/(.*).png",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*).svg",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
