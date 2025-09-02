import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

import home from "../assets/images/home.svg";
import homeActive from "../assets/images/home-active.svg";
import calendar from "../assets/images/calendar.svg";
import calendarActive from "../assets/images/calendar-active.svg";
import diary from "../assets/images/diary.svg";
import diaryActive from "../assets/images/diary-active.svg";
import profile from "../assets/images/profile.svg";
import profileActive from "../assets/images/profile-active.svg";
const DEFAULT_ITEMS = [
  {
    to: "/",
    label: "홈",
    iconSrc: home,
    iconActiveSrc: homeActive,
    isActive: (p) => p === "/home",
  },
  {
    to: "/calendar",
    label: "캘린더",
    iconSrc: calendar,
    iconActiveSrc: calendarActive,
    isActive: (p) => p.startsWith("/calendar"),
  },
  {
    to: "/diary",
    label: "다이어리",
    iconSrc: diary,
    iconActiveSrc: diaryActive,
    isActive: (p) => p.startsWith("/diary"),
  },
  {
    to: "/profile",
    label: "프로필",
    iconSrc: profile,
    iconActiveSrc: profileActive,
    isActive: (p) => p.startsWith("/profile"),
  },
];

export default function NavBar({ items = DEFAULT_ITEMS, position = "fixed", className }) {
  const { pathname } = useLocation();

  return (
    <Bar $position={position} className={className} aria-label="Bottom navigation">
      <Inner>
        {items.map(({ to, label, iconSrc, iconActiveSrc, isActive }, i) => {
          const active = isActive ? isActive(pathname) : pathname === to;
          const src = active && iconActiveSrc ? iconActiveSrc : iconSrc;

          return (
            <Item
              key={`${to}-${i}`}
              to={to}
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {src ? (
                <IconImg
                  src={src}
                  alt=""
                  aria-hidden
                  draggable={false}
                  loading="eager"
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


/* 각 아이템(링크) */
const Item = styled(NavLink)`
  width: 100%;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  /* 라벨 기본색 */
  color: var(--text-2);
  transition: color 0.15s ease, transform 0.15s ease;

  /* 활성 시 라벨 컬러 */
  &[data-active="true"] { color: var(--text-1); }

  /* 호버 시 라벨 강조 */
  &:hover { color: var(--text-1); }
`;

/* 아이콘 이미지 (디자이너 제공 파일 사용) */
const IconImg = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex: 0 0 auto;
  pointer-events: none;
  transition: transform 0.15s ease, opacity 0.15s ease;

  /* 활성 상태 살짝 떠오르는 효과 */
  ${Item}[data-active="true"] & {
    transform: translateY(-1px);
  }
`;


const Label = styled.span`
  font-size:  var(--fs-xs, 12px);
  line-height: 1;
  user-select: none;
`;

const Bar = styled.nav`
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  ${({ $position }) =>
    $position === "sticky"
      ? css`position: sticky;`
      : css`position: fixed;`}

  background: var(--bg-1);
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