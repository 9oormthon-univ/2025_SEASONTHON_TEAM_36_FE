import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { Home, Calendar, NotebookPen, UserRound } from "lucide-react";

/* 각 아이템(링크) */
const Item = styled(NavLink)`
  width: 100%;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  /* 라벨 기본색 = Text/Text 2 */
  color: var(--text-2);
  transition: color 0.15s ease, transform 0.15s ease;

  /* 선택 시 라벨 = Text/Text 1 */
  &[data-active="true"] { color: var(--text-1); }

  /* 호버 시 라벨 강조 */
  &:hover { color: var(--text-1); }
`;

/* 아이콘 */
const Icon = styled.i`
  /* 비선택 아이콘 = Icon/icon-color 4 */
  color: var(--icon-4);
  transition: transform 0.15s ease, color 0.15s ease;

  /* 선택 아이콘 = Icon/icon */
  ${Item}[data-active="true"] & {
    color: var(--icon);
    transform: translateY(-1px);
  }
`;

/* 라벨 */
const Label = styled.span`
  font-size: 12px;
  line-height: 1;
  user-select: none;
`;

/* 바깥 컨테이너 */
const Bar = styled.nav`
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  ${({ $position }) =>
    $position === "sticky"
      ? css`position: sticky;`
      : css`position: fixed;`}

  /* GlobalStyle 사용 */
  background: var(--bg-1);

  /* 경계선은 팔레트 토큰 사용 */
  border-top: 1px solid var(--natural-400);

  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --navbar-height: calc(16px + 54px + 34px + var(--safe-bottom));
`;

/* 내부 컨테이너 */
const Inner = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 16px 0 calc(34px + env(safe-area-inset-bottom, 0px));

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  justify-items: center;
  align-items: center;
`;

const DEFAULT_ITEMS = [
  { to: "/",         label: "홈",       icon: Home,        isActive: (p) => p === "/" },
  { to: "/calendar", label: "캘린더",   icon: Calendar,    isActive: (p) => p.startsWith("/calendar") },
  { to: "/diary",    label: "다이어리", icon: NotebookPen, isActive: (p) => p.startsWith("/diary") },
  { to: "/profile",  label: "프로필",    icon: UserRound,   isActive: (p) => p.startsWith("/profile") },
];

export default function NavBar({ items = DEFAULT_ITEMS, position = "fixed", className }) {
  const { pathname } = useLocation();

  return (
    <Bar $position={position} className={className} aria-label="Bottom navigation">
      <Inner>
        {items.map(({ to, label, icon: IconCmp, isActive }, i) => {
          const active = isActive ? isActive(pathname) : pathname === to;
          return (
            <Item
              key={`${to}-${i}`}
              to={to}
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {IconCmp ? (
                <Icon
                  as={IconCmp}
                  size={22}
                  aria-hidden
                  /* 선택 시 두께 강조 */
                  strokeWidth={active ? 2.8 : 2}
                />
              ) : null}
              <Label>{label}</Label>
            </Item>
          );
        })}
      </Inner>
    </Bar>
  );
}
