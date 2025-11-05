// src/pages/diary/components/ClockPie24.tsx
import { useMemo, useState } from "react"; // 리액트 훅들 임포트
import { Cell, Pie, PieChart as RChart, ResponsiveContainer } from "recharts"; // Recharts 컴포넌트들
import styled from "styled-components"; // 스타일드 컴포넌트

import type { GoalForChart } from "../utils/diaryUtils"; // 차트 데이터 표준 타입

const TOTAL_SECONDS = 24 * 60 * 60; // 24시간(초) = 86,400
const REMAIN_ID = -1 as const; // '남은 시간' 조각에 쓸 센티널 ID(숫자)

type Slice = {
  // 파이 조각에 사용할 내부 타입
  id: number; // 조각 식별자
  name: string; // 라벨
  value: number; // 값(초) — Recharts에서 dataKey로 사용
  color: string; // 칠할 색상
  isRemain: boolean; // 남은 시간 조각 여부
};

export default function ClockPie24({
  // 24시간 파이 차트 컴포넌트
  goals, // 입력 목표들(초 단위 timeSecs 포함)
  size = 0, // SVG 뷰박스 크기(px)
  padAngle = 0, // 조각 사이 간격(도 단위)
}: {
  goals: GoalForChart[]; // props 타입: 표준화된 차트 데이터
  size?: number;
  padAngle?: number;
  thickness?: number; // (현재 미사용: 도넛 변형 대비)
  showCenterInfo?: boolean;
}) {
  const { data } = useMemo(() => {
    // 입력 goals → 파이 조각들로 변환(메모이제)
    const safe = (goals ?? []).map(g => ({
      // null/undefined 방어 후 매핑
      id: Number(g.id), // id는 number로 강제
      name: g.name, // 라벨
      value: Math.max(0, Math.floor(g.timeSecs || 0)), // 초 단위 값(음수/NaN 방지)
      color: g.color, // 색상
      isRemain: false, // 기본: 남은 시간 아님
    }));
    const usedSecs = safe.reduce((a, b) => a + b.value, 0); // 사용된 총 집중 시간(초)
    const remain = Math.max(0, TOTAL_SECONDS - usedSecs); // 24h 기준 남은 시간(초, 최소 0)
    const arr: Slice[] = [...safe]; // 조각 배열 복사
    if (remain > 0) {
      // 남은 시간이 있다면
      arr.push({
        // '남은 시간' 조각을 추가
        id: REMAIN_ID,
        name: "남은 시간",
        value: remain,
        color: "white", // 배경처럼 보이게 흰색
        isRemain: true,
      });
    }
    return { data: arr, used: usedSecs }; // 조각 목록과 사용 총합 반환
  }, [goals]); // goals 변경시에만 재계산

  const [selectedId, setSelectedId] = useState<number | null>(null); // 선택된 조각 ID 상태

  // 12시(위)에서 시작해서 시계 방향으로 그리기 위한 각도 설정
  const START_ANGLE = 90; // Recharts: 0도=3시 → 90도=12시
  const END_ANGLE = -270; // 12시부터 시계 방향 한 바퀴

  // 원형 반지름(외곽): 도넛이 아니라 꽉 채우는 파이여서 innerRadius는 0으로 둘 것
  const radiusOuter = size / 2 - 2; // 외곽 반지름

  const labelRadius = radiusOuter + 10; // 시계 숫자(0·6·12·18) 배치 반지름

  return (
    <Wrap style={{ width: size, height: size }}>
      {/* 컴포넌트 래퍼(절대 배치용) */}
      <ResponsiveContainer width="100%" height="100%">
        {/* 부모 크기에 맞춰 SVG 반응형 */}
        <RChart>
          {/* 외곽 원 테두리 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radiusOuter}
            fill="none"
            stroke="var(--natural-400)"
            strokeWidth="1.2"
          />
          <Pie
            data={data} // 조각들
            dataKey="value" // 값 필드 키
            nameKey="name" // 라벨 필드 키
            startAngle={START_ANGLE} // 시작 각도(12시)
            endAngle={END_ANGLE} // 끝 각도(시계방향 360도)
            innerRadius={0} // ★ 파이(중앙까지 채우기)
            outerRadius={radiusOuter} // 외곽 반지름
            paddingAngle={padAngle} // 조각 간격(도)
            isAnimationActive={false} // 애니메이션 끔(퍼포먼스/안정)
            strokeWidth={0} // 각 조각 경계선 두께
          >
            {data.map(entry => {
              // 각 조각을 Cell로 렌더링
              const isSelected = selectedId != null && selectedId === entry.id; // 선택 여부
              return (
                <Cell
                  key={entry.id} // React key
                  fill={entry.color} // 조각 색상
                  onClick={() =>
                    // 클릭 시 선택 토글
                    setSelectedId(prev => (prev === entry.id ? null : entry.id))
                  }
                  style={{
                    cursor: entry.isRemain ? "default" : "pointer", // 남은 시간은 포인터 X
                    transform: isSelected && !entry.isRemain ? "scale(1.03)" : undefined, // 선택시 살짝 확대
                    transformOrigin: "center", // 확대 기준점
                    transition: "transform 120ms ease", // 부드러운 확대 애니메이션
                  }}
                />
              );
            })}
          </Pie>
          {/* 시계 눈금(0,6,12,18) */}
          {[
            { text: "0", deg: -90 }, // 12시
            { text: "6", deg: 0 }, // 3시
            { text: "12", deg: 90 }, // 6시
            { text: "18", deg: 180 }, // 9시
          ].map(t => {
            const rad = (t.deg * Math.PI) / 180; // 도 → 라디안
            const cx = size / 2 + (labelRadius + 5) * Math.cos(rad); // 라벨 x 좌표
            const cy = size / 2 + (labelRadius + 5) * Math.sin(rad); // 라벨 y 좌표
            return (
              <text
                key={t.text} // React key
                x={cx}
                y={cy} // 라벨 위치
                textAnchor="middle" // 가운데 정렬
                dominantBaseline="middle" // 수직 중앙 정렬
                fill="var(--text-1)" // 라벨 색
                fontSize={14} // 라벨 크기
              >
                {t.text} {/* 라벨 내용 */}
              </text>
            );
          })}
        </RChart>
      </ResponsiveContainer>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
`;
