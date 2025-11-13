// src/pages/diary/components/RatioPie.tsx
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart as RChart, ResponsiveContainer } from "recharts";
import styled from "styled-components";

import frogCookie from "@/assets/images/frog-cookie.svg"; // ⬅ 경로는 프로젝트에 맞게 조정

import type { GoalForChart } from "../utils/diaryUtils";

type Slice = {
  id: number;
  name: string;
  value: number; // ratio 기반 값
  color: string;
  timeSecs: number; // 말풍선에 보여줄 실제 시간(초)
};

export default function RatioPie({
  goals,
  size = 0,
  padAngle = 0,
}: {
  goals: GoalForChart[];
  size?: number;
  padAngle?: number;
  thickness?: number; // (현재 미사용: 도넛 변형 대비)
  showCenterInfo?: boolean;
}) {
  // 12시(위)에서 시작해서 시계 방향으로 그리기 위한 각도 설정
  const START_ANGLE = 90; // Recharts: 0도=3시 → 90도=12시
  const END_ANGLE = -270; // 12시부터 시계 방향 한 바퀴
  const SWEEP = END_ANGLE - START_ANGLE; // -360

  const { data, totalRatio, cumAngles, totalTimeSecs } = useMemo(() => {
    // ratio를 기반으로 파이 조각 크기 계산
    const safe: Slice[] = (goals ?? []).map(g => ({
      id: Number(g.id),
      name: g.name,
      value: Math.max(0, typeof g.ratio === "number" ? g.ratio : 0), // ratio가 숫자면 사용, 아니면 0
      color: g.color,
      timeSecs: Math.max(0, Math.floor(g.timeSecs || 0)), // 말풍선용 시간
    }));

    const totalRatio = safe.reduce((a, b) => a + b.value, 0);

    // ratio가 0 이하인 건 실제 파이에서는 그리지 않도록 필터링
    const arr = safe.filter(s => s.value > 0);

    // timeSecs 총합
    const totalTimeSecs = safe.reduce((a, b) => a + b.timeSecs, 0);

    const tot = arr.reduce((a, b) => a + b.value, 0) || 1; // 0 분모 방지
    const res: Array<{ id: number; startDeg: number; endDeg: number; midDeg: number }> = [];
    let acc = 0;

    for (const s of arr) {
      const startDeg = START_ANGLE + (acc / tot) * SWEEP;
      const endDeg = START_ANGLE + ((acc + s.value) / tot) * SWEEP;
      const midDeg = (startDeg + endDeg) / 2;
      res.push({ id: s.id, startDeg, endDeg, midDeg });
      acc += s.value;
    }

    return { data: arr, totalRatio, cumAngles: res, totalTimeSecs };
  }, [goals]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const radiusOuter = size / 2 - 2;
  const _labelRadius = radiusOuter + 10; // (현재는 외곽 원 위치 계산에만 사용)

  // ----- 유틸 -----
  const fmtHMS = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(
      2,
      "0",
    )}`;
  };
  const _fmtTextLegacy = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return `${h}시간 ${m}분 ${r}초`;
  };
  const fmtText = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;

    const parts: string[] = [];
    if (h > 0) parts.push(`${h}시간`);
    if (m > 0) parts.push(`${m}분`);
    if (r > 0) parts.push(`${r}초`);

    // 전부 0이면 0초 (사실상 렌더링되는 경우 없음)
    if (parts.length === 0) return "0초";

    return parts.join(" ");
  };
  const timeText = fmtText(totalTimeSecs);

  const deg2rad = (deg: number) => (deg * Math.PI) / 180;

  // 선택된 조각의 말풍선 좌표 계산 (중앙각 기준)
  const bubble = useMemo(() => {
    if (selectedId == null) return null;
    const s = data.find(d => d.id === selectedId);
    if (!s) return null;
    const angles = cumAngles.find(a => a.id === selectedId);
    if (!angles) return null;

    // 말풍선 위치: 원의 75% 지점 기준, 약간 바깥쪽으로
    const r = radiusOuter * 0.75;
    const rad = deg2rad(angles.midDeg);
    const x = size / 2 + r * Math.cos(rad);
    const y = size / 2 - r * Math.sin(rad);

    return {
      left: x,
      top: y,
      text: fmtHMS(s.timeSecs), // ratio가 아니라 실제 수행시간 표시
    };
  }, [selectedId, data, cumAngles, radiusOuter, size]);

  // ratio 합이 0이면 차트 영역에 frog-cookie.svg
  if (!totalRatio) {
    return (
      <Wrap style={{ width: size, height: size }}>
        <EmptyCenter>
          <img src={frogCookie} alt="데이터 없음" />
        </EmptyCenter>
      </Wrap>
    );
  }

  return (
    <>
      <Wrap style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RChart>
            {/* 외곽 원 테두리 (디자인용) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radiusOuter}
              fill="none"
              stroke="var(--natural-400)"
              strokeWidth="1.2"
            />
            <Pie
              data={data}
              dataKey="value" // ★ ratio 기반 값으로 파이 조각 비율 계산
              nameKey="name"
              startAngle={START_ANGLE}
              endAngle={END_ANGLE}
              innerRadius={0}
              outerRadius={radiusOuter}
              paddingAngle={padAngle}
              isAnimationActive={false}
              strokeWidth={0}
            >
              {data.map(entry => {
                const isSelected = selectedId != null && selectedId === entry.id;
                return (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    onClick={() => setSelectedId(prev => (prev === entry.id ? null : entry.id))}
                    style={{
                      cursor: "pointer",
                      transform: isSelected ? "scale(1.025)" : undefined,
                      transformOrigin: "center",
                      transition: "transform 120ms ease",
                    }}
                  />
                );
              })}
            </Pie>
          </RChart>
        </ResponsiveContainer>
        {bubble && (
          <Bubble
            style={{
              left: bubble.left,
              top: bubble.top,
              transform: "translate(-50%, -110%)",
            }}
          >
            {bubble.text}
          </Bubble>
        )}
      </Wrap>
      <TotalLabel>
        오늘은 총 <Highlight>{timeText}</Highlight> 집중했어요!
      </TotalLabel>
    </>
  );
}

const Wrap = styled.div`
  position: relative;
`;

const EmptyCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }
`;

const Bubble = styled.div`
  position: absolute;
  z-index: 2;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--olive-green);
  color: white;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, 0);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--olive-green);
  }
`;

const TotalLabel = styled.div`
  color: var(--text-2);
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  word-break: keep-all;
  padding: 10px 0;
`;

const Highlight = styled.span`
  color: var(--green-500);
  font-weight: 600;
  font-size: 16px;
  word-break: keep-all;
`;
