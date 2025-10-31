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
    <>
      <Shell className={className}>
        <Outlet />
      </Shell>
      <NavBar position={navbarPosition} />
    </>
  );
}

/** ====== 전체 레이아웃 컨테이너 ====== */
const Shell = styled.div`
  /* 색상 토큰 */
  background: var(--bg-1);
  color: var(--text-1);

  /* safe-area 환경 변수 */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);

  /* NavBar 높이 (하단 safe-area 포함) */
  --navbar-height: calc(54px + 34px + var(--safe-bottom));

  /* 화면 전체 높이에서 NavBar 높이를 뺀 만큼만 */
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  /* 상태바 여백 */
  padding-top: var(--safe-top);
  box-sizing: border-box;

  /* overflow가 필요하다면 활성화 */
  overflow-y: auto;
`;
