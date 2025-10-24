import { Coordinate } from "../types/constellation";

export const createLineProps = (
  star1: Coordinate,
  star2: Coordinate,
  isStar1Big: boolean,
  isStar2Big: boolean,
) => {
  // 별의 크기에 따른 반지름 계산 (큰 별: 17.1px, 작은 별: 8px)
  const star2Radius = isStar2Big ? 17.1 : 8;

  const dx = star1.x - star2.x;
  const dy = star1.y - star2.y;
  const $distance = Math.sqrt(dx * dx + dy * dy) + (isStar1Big !== isStar2Big ? 2 : 0);
  const $angle =
    Math.atan2(dy, dx) * (180 / Math.PI) +
    (isStar1Big && isStar2Big ? 0 : isStar1Big && !isStar2Big && star1.y < star2.y ? 5 : -5);

  // 시작점 (star2에서 star1 방향으로 별의 반지름만큼 이동)
  const startX = star2.x + star2Radius;
  const startY = star2.y + star2Radius;

  return {
    $left: startX,
    $top: startY,
    $distance,
    $angle,
  };
};
