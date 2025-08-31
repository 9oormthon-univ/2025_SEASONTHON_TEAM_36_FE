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

    /* 이외 사용되는 색상 */
    --blue: #8FE5FF;
  }

  /* ===== 2) Semantic tokens: Light ===== */
  :root[data-theme="light"] {
    /* Brand */
    --brand-1: #007410;   
    --brand-2: #000000;  

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

    /* Background / Surface */
    --bg-1:       #FFFFFF;
    --bg-1-soft:  #F8FBFF;
    --bg-2:       linear-gradient(0deg, #FFFFFF 0%, #ECFFE2 100%);
    --surface-1:  var(--bg-1);
    --surface-2:  var(--bg-1-soft);
  }

  /* ===== 3) Semantic tokens: Dark ===== */
  :root[data-theme="dark"] {
    /* Brand */
    --brand-1: #49C400;   
    --brand-2: #FFFFFF;   

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

    /* Background / Surface */
    --bg-1:       #FFFFFF;
    --bg-1-soft:  #FFFFFF;
    --bg-2:       linear-gradient(0deg, #FFFFFF 0%, #ECFFE2 100%);
    --surface-1:  var(--bg-1);
    --surface-2:  var(--bg-1-soft);
  }

  /* 수정 가능성 있음 */
  /* ===== 4) Global base ===== */
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    background: var(--bg-1);
    color: var(--text-1);
    font-family: 'Pretendard', system-ui, -apple-system, sans-serif;
  }
`;
