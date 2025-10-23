import { NavLink, useLocation } from "react-router-dom";

import calendar from "@/assets/images/calendar.svg";
import calendarfill from "@/assets/images/calendar-fill.svg";
import diary from "@/assets/images/diary.svg";
import diaryfill from "@/assets/images/diary-fill.svg";
import home from "@/assets/images/home.svg";
import homefill from "@/assets/images/home-fill.svg";
import profile from "@/assets/images/profile.svg";
import profilefill from "@/assets/images/profile-fill.svg";

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
  iconfillSrc?: string;
  /** 활성 여부 판별 함수 (선택적) */
  isfill?: (path: string) => boolean;
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
    iconfillSrc: homefill,
    isfill: p => p === "/home",
  },
  {
    to: "/calendar",
    label: "캘린더",
    iconSrc: calendar,
    iconfillSrc: calendarfill,
    isfill: p => p.startsWith("/calendar"),
  },
  {
    to: "/diary",
    label: "다이어리",
    iconSrc: diary,
    iconfillSrc: diaryfill,
    isfill: p => p.startsWith("/diary"),
  },
  {
    to: "/profile",
    label: "프로필",
    iconSrc: profile,
    iconfillSrc: profilefill,
    isfill: p => p.startsWith("/profile"),
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
        {items.map(({ to, label, iconSrc, iconfillSrc, isfill }, i) => {
          const fill = isfill ? isfill(pathname) : pathname === to;
          const src = fill && iconfillSrc ? iconfillSrc : iconSrc;

          return (
            <Item
              key={`${to}-${i}`}
              as={NavLink}
              to={to}
              data-fill={fill}
              aria-current={fill ? "page" : undefined}
            >
              {src ? (
                <IconImg src={src} alt="" aria-hidden draggable={false} loading="eager" />
              ) : null}
              <Label className="typo-label-s">{label}</Label>
            </Item>
          );
        })}
      </Inner>
    </Bar>
  );
}
