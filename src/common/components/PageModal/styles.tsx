import styled from "styled-components";

/* ===== styles: NavBar 제외 전체 덮기 ===== */
export const Screen = styled.div<{
  $viewNavBar?: boolean;
  $bgColor?: string; // ☁️ 배경색 prop 추가
}>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;

  /* viewNavBar가 true면 NavBar 높이만큼 비워서 NavBar 클릭 가능 */
  bottom: ${({ $viewNavBar }) =>
    $viewNavBar
      ? "calc(var(--navbar-height, calc(54px + 34px + env(safe-area-inset-bottom, 0px))) + 1px)"
      : "0"};

  z-index: 2147483647; /* 앱 모든 요소 위 */
  background: ${({ $bgColor }) => $bgColor ?? "var(--bg-1)"}; /* 기본값 fallback */
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;

  /* 살짝 위에서 슬라이드-인 */
  transform: translateY(4%);
  opacity: 0.01;
  animation: pageEnter 220ms ease forwards;
  @keyframes pageEnter {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
    opacity: 1;
  }
`;

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  gap: 8px;

  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;

  background: transparent;
`;

export const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: clamp(16px, 2.5vw, 18px);
  font-weight: 800;
  color: var(--text-1);
`;

export const Spacer = styled.div`
  width: 40px;
  height: 36px;
`;

export const IconBtn = styled.button`
  padding: 4px 4px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

export const IconImg = styled.img`
  width: 14px;
  height: 14px;
  display: block;
`;

export const Body = styled.div`
  flex: 1 1 auto;
  overflow: auto;
  padding: 12px 16px calc(env(safe-area-inset-bottom, 0px) + 12px);
`;
