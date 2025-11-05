// src/features/daily/utils/weather.ts
import activeCloudy from "@/assets/images/weathers/a-cloudy.svg";
import activeFoggy from "@/assets/images/weathers/a-foggy.svg";
import activeRainy from "@/assets/images/weathers/a-rainy.svg";
import activeSnowy from "@/assets/images/weathers/a-snowy.svg";
import activeSunny from "@/assets/images/weathers/a-sunny.svg";
import cloudy from "@/assets/images/weathers/cloudy.svg";
import foggy from "@/assets/images/weathers/foggy.svg";
import rainy from "@/assets/images/weathers/rainy.svg";
import snowy from "@/assets/images/weathers/snowy.svg";
import sunny from "@/assets/images/weathers/sunny.svg";
import type { Weather } from "@/common/types/enums";

/** 선택지 정의 (UI 라벨) */
export const WEATHERS = [
  { id: "sunny", label: "맑음" },
  { id: "cloudy", label: "구름" },
  { id: "rainy", label: "비" },
  { id: "foggy", label: "안개" },
  { id: "snowy", label: "눈" },
] as const;

export type WeatherId = (typeof WEATHERS)[number]["id"];

/** 아이콘 매핑(기본/활성) */
export const WEATHER_ICONS: Record<WeatherId, { idle: string; active: string }> = {
  sunny: { idle: sunny, active: activeSunny },
  cloudy: { idle: cloudy, active: activeCloudy },
  rainy: { idle: rainy, active: activeRainy },
  foggy: { idle: foggy, active: activeFoggy },
  snowy: { idle: snowy, active: activeSnowy },
};

/** UI → 서버 enum */
export const WEATHER_TO_ENUM: Record<WeatherId, Weather> = {
  sunny: "SUNNY",
  cloudy: "CLOUDY",
  rainy: "RAINY",
  foggy: "WINDY", // 백엔드 스펙에 맞춰 유지 (안개=foggy가 WINDY로 매핑되는 사양)
  snowy: "SNOWY",
};

/** 서버 enum → UI */
export const ENUM_TO_WEATHER_ID: Record<Weather, WeatherId> = {
  SUNNY: "sunny",
  CLOUDY: "cloudy",
  RAINY: "rainy",
  WINDY: "foggy",
  SNOWY: "snowy",
};

/** 헬퍼: 서버 enum에서 라벨 얻기 */
export function getWeatherLabelFromEnum(w: Weather) {
  const id = ENUM_TO_WEATHER_ID[w];
  return WEATHERS.find(x => x.id === id)?.label ?? "";
}

/** 헬퍼: UI id 기준 아이콘 세트 */
export function getWeatherIcons(id: WeatherId) {
  return WEATHER_ICONS[id];
}
