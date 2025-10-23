import { Outlet } from "react-router-dom";
import styled from "styled-components";

import NavBar from "./NavBar";

/** ====== Props 타입 정의 ====== */
export interface AppLayoutProps {
  /** NavBar 위치 ("fixed" | "static" 등) */
  navbarPosition?: "fixed";
  /** 커스텀 클래스명 */
  className?: string;
}

/** ====== 레이아웃 컴포넌트 ====== */
export default function AppLayout({ navbarPosition = "fixed", className }: AppLayoutProps) {
  return (
    <Shell className={className}>
      <Main id="content" role="main">
        <Outlet />
      </Main>
      <NavBar position={navbarPosition} />
    </Shell>
  );
}

/** 전체 레이아웃 컨테이너 */
const Shell = styled.div`
  /* GlobalStyle의 토큰 사용 */
  background: var(--bg-1);
  color: var(--text-1);

  /* iOS safe-area 값 */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);

  --navbar-height: calc(54px + 34px + var(--safe-bottom));

  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  /* 상단 상태바 여백 */
  padding-top: var(--safe-top);
`;

/** 메인 콘텐츠 영역: NavBar 공간만큼 하단 패딩 확보 */
const Main = styled.main`
  box-sizing: border-box;
  flex: 1 1 auto;
  width: 100%;
  padding-bottom: var(--navbar-height);
`;
