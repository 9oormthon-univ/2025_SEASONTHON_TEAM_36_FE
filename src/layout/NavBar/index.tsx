import { NavLink, useLocation } from "react-router-dom";

import calendar from "@/assets/images/calendar.svg";
import calendarActive from "@/assets/images/calendar-active.svg";
import diary from "@/assets/images/diary.svg";
import diaryActive from "@/assets/images/diary-active.svg";
import home from "@/assets/images/home.svg";
import homeActive from "@/assets/images/home-active.svg";
import profile from "@/assets/images/profile.svg";
import profileActive from "@/assets/images/profile-active.svg";

import { Bar, type BarPosition, IconImg, Inner, Item, Label } from "./styles";

/** Nav 아이템 타입 */
export interface NavItem {
  /** 이동 경로 */
  to: string;
  /** 표시될 라벨 */
  label: string;
  /** 기본 아이콘 */
  iconSrc?: string;
  /** 활성 상태 아이콘 */
  iconActiveSrc?: string;
  /** 활성 여부 판별 함수 (선택적) */
  isActive?: (path: string) => boolean;
}

/** NavBar Props 타입 */
export interface NavBarProps {
  /** 네비게이션 아이템 목록 */
  items?: NavItem[];
  /** 위치 전략: fixed | sticky (기본 fixed) */
  position?: BarPosition;
  /** 추가 className */
  className?: string;
}

/** 기본 아이템 정의 */
const DEFAULT_ITEMS: NavItem[] = [
  {
    to: "/home",
    label: "홈",
    iconSrc: home,
    iconActiveSrc: homeActive,
    isActive: p => p === "/home",
  },
  {
    to: "/calendar",
    label: "캘린더",
    iconSrc: calendar,
    iconActiveSrc: calendarActive,
    isActive: p => p.startsWith("/calendar"),
  },
  {
    to: "/diary",
    label: "다이어리",
    iconSrc: diary,
    iconActiveSrc: diaryActive,
    isActive: p => p.startsWith("/diary"),
  },
  {
    to: "/profile",
    label: "프로필",
    iconSrc: profile,
    iconActiveSrc: profileActive,
    isActive: p => p.startsWith("/profile"),
  },
];

/** 컴포넌트 본체 */
export default function NavBar({
  items = DEFAULT_ITEMS,
  position = "fixed",
  className,
}: NavBarProps) {
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
              as={NavLink}
              to={to}
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {src ? (
                <IconImg src={src} alt="" aria-hidden draggable={false} loading="eager" />
              ) : null}
              <Label>{label}</Label>
            </Item>
          );
        })}
      </Inner>
    </Bar>
  );
}
