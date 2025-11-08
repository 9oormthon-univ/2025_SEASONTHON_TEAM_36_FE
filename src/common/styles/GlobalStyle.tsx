// src/common/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* ===== 1) Palette (절대값) ===== */
  :root {
    /* green */
    --green-500: #0E7400;
    --green-400: #18A904;
    --green-300: #48D535;
    --green-200: #86EC78;
    --green-100: #C0FBB8;

    /* Natural color */
    --natural-1000: #000000;
    --natural-800:  #6F737B;
    --natural-600:  #969BA5;
    --natural-400:  #D6D9E0;
    --natural-200:  #F1F4F8;
    --natural-0:    #FFFFFF;

    /* 감정표현 */
    --basic: #FFFFFF;
    --yellow1: #FFE578;
    --yellow2: #FFFF4A;
    --pink: #FFC8F2;
    --oragne: #FFB378;
    --deep-blue: #75A0CE;
    --olive-green: #9BAEAA;
    --red: #EA7678;
    --deep-brown: #74626B;

    /* 이외 사용되는 색상 */
    --blue: #8FE5FF;

    /* ===== Typography Primitives ===== */
    /* Font Size */
    --fs-3xl: 36px;
    --fs-2xl: 24px;
    --fs-xl:  20px;
    --fs-lg:  16px;
    --fs-md:  15px;
    --fs-sm:  14px;
    --fs-xs:  12px;

    /* Line Height */
    --lh-xl: 64px;
    --lh-l:  28px;
    --lh-m:  24px;
    --lh-ms: 20px;
    --lh-s:  16px;

    /* Letter Spacing */
    --ls-1: 0.6px;
    --ls-2: 0px;
    --ls-3: -0.25px;

    /* Font Weight */
    --fw-b: 700;  /* Bold   */
    --fw-m: 500;  /* Medium */
    --fw-r: 400;  /* Regular */

    /* Font Family */
    --ff-sans: 'Pretendard', system-ui, -apple-system, "Segoe UI", Roboto,
               "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  }

  /* ===== 2) Semantic tokens: Light ===== */
  :root[data-theme="light"] {
    /* Brand */
    --primary-1: #007410;
    --primary-2: #000000;

    /* Text color */
    --text-1:  #000000;
    --text-2:  #6F737B;
    --text-3:  #969BA5;
    --text-w1: #FFFFFF;
    --text-w2: #F1F4F8;

    /* icon */
    --icon:   #000000;
    --icon-1: #969BA5;
    --icon-2: #007410;
    --icon-3: #FFFFFF;
    --icon-4: #6F737B;

    /* Background */
    --bg-1:       #FFFFFF;
    --bg-2:  #F8FBFF;
    --bg-3:       linear-gradient(0deg, #FFFFFF 0%, #ECFFE2 100%);
  }

  /* ===== 3) Semantic tokens: Dark ===== */
  :root[data-theme="dark"] {
    /* Brand */
    --primary-1: #49C400;
    --primary-2: #FFFFFF;

    /* Text color */
    --text-1:  #FFFFFF;
    --text-2:  #F1F4F8;
    --text-3:  #D6D9E0;
    --text-w1: #FFFFFF;
    --text-w2: #F1F4F8;

    /* icon */
    --icon:   #FFFFFF;
    --icon-1: #F1F4F8;
    --icon-2: #49C400;
    --icon-3: #FFFFFF;
    --icon-4: #F1F4F8;

    /* Background */
    --bg-1:       #0E1116;
    --bg-2:  #131821;
    --bg-3:       linear-gradient(0deg, #0E1116 0%, #10151C 100%);
  }

  /* ===== 4) Typography semantic styles ===== */
/* 필요 시 토큰으로 바꾸기 쉽게 변수로 분리함 (이 부분만 Primitive(Font Size)랑 다름*/
:root { --h1-size: 28px; } /* 디자인시스템 값. 토큰 쓰려면 var(--fs-3xl) */

.typo-h1 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-b);
  font-size: var(--h1-size);       /* or var(--fs-3xl) */
  line-height: var(--lh-s);
  letter-spacing: var(--ls-2);
}

.typo-h2 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-b);
  font-size: var(--fs-2xl);
  line-height: var(--lh-l);
  letter-spacing: var(--ls-2);
}

.typo-h3 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-b);
  font-size: var(--fs-xl);
  line-height: 1.4;                /* 140% */
  letter-spacing: var(--ls-2);
}

.typo-h4 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-b);
  font-size: var(--fs-lg);
  line-height: 1.4;                /* 140% */
  letter-spacing: var(--ls-2);
}

.typo-title-1 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-2xl);
  line-height: var(--lh-xl);
  letter-spacing: var(--ls-3);     /* -0.25px */
}

.typo-title-2 {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-xl);
  line-height: var(--lh-l);
  letter-spacing: var(--ls-3);     /* -0.25px */
}

.typo-label-l {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-lg);
  line-height: 1;                  /* 100% */
  letter-spacing: var(--ls-2);
}

.typo-label-m {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-md);
  line-height: var(--lh-xl);       /* 시안: 64 */
  letter-spacing: var(--ls-3);     /* -0.25px */
}

.typo-label-s {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-xs);
  line-height: var(--lh-s);
  letter-spacing: var(--ls-1);     /* 0.6px */
}

.typo-button {
  font-family: var(--ff-sans);
  font-weight: var(--fw-m);
  font-size: var(--fs-lg);
  line-height: var(--lh-m);        /* 24 */
  letter-spacing: var(--ls-2);
}

.typo-body-l {
  font-family: var(--ff-sans);
  font-weight: var(--fw-r);
  font-size: var(--fs-lg);
  line-height: 1.4;                /* 140% */
  letter-spacing: var(--ls-2);
}

.typo-body-m {
  font-family: var(--ff-sans);
  font-weight: var(--fw-r);
  font-size: var(--fs-md);
  line-height: var(--lh-m);        /* 24 */
  letter-spacing: var(--ls-3);     /* -0.25px */
}

.typo-body-s {
  font-family: var(--ff-sans);
  font-weight: var(--fw-r);
  font-size: var(--fs-sm);
  line-height: 1.4;                /* 140% */
  letter-spacing: var(--ls-2);
}

.typo-body-xs {
  font-family: var(--ff-sans);
  font-weight: var(--fw-r);
  font-size: var(--fs-xs);
  line-height: 1.4;                /* 140% */
  letter-spacing: var(--ls-2);
}


  /* ===== 5) Global base ===== */
  html, body, #root { height: 100%; overflow-x: hidden;}
  body {
    margin: 0;
    background: var(--bg-1);
    color: var(--text-1);
    font-family: var(--ff-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
