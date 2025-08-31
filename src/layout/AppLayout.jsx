import { Outlet } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./NavBar";

/** 전체 레이아웃 컨테이너 */
const Shell = styled.div`
  /* GlobalStyle의 토큰 사용 */
  background: var(--bg-1);
  color: var(--text-1);

  /* iOS safe-area + NavBar 실제 높이(패딩+아이템영역+라벨영역) */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --navbar-height: calc(16px + 54px + 34px + var(--safe-bottom));

  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

/** 메인 콘텐츠 영역: NavBar 공간만큼 하단 패딩 확보 */
const Main = styled.main`
  box-sizing: border-box;
  flex: 1 1 auto;
  width: 100%;
  padding-bottom: var(--navbar-height);
`;

export default function AppLayout({ navbarPosition = "fixed", className }) {
  return (
    <Shell className={className}>
      <Main id="content" role="main">
        <Outlet />
      </Main>
      <NavBar position={navbarPosition} />
    </Shell>
  );
}
