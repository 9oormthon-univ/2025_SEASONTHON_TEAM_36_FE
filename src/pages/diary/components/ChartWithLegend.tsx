// src/pages/diary/components/ChartWithLegend.tsx
import { useMemo } from "react";
import styled from "styled-components";

import type { GoalForChart } from "../utils/diaryUtils";
import ClockPie24 from "./ClockPie24";

/** 초 단위를 항상 HH:MM:SS 형태로 포맷합니다. */
function fmtHMS(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  return [String(h).padStart(2, "0"), String(m).padStart(2, "0"), String(s).padStart(2, "0")].join(
    ":",
  );
}

export default function ChartWithLegend({
  goals,
  chartWidthPct = 75,
  emptyText = "오늘 한 일 데이터가 없습니다",
}: {
  goals: GoalForChart[];
  chartWidthPct?: number; // 차트 가로 비율(%)
  emptyText?: string;
}) {
  // 내부 렌더링용 데이터로 정규화
  const data = useMemo(
    () =>
      (goals ?? []).map(g => ({
        id: g.id,
        label: g.name,
        color: g.color,
        value: Math.max(0, Number.isFinite(g.timeSecs) ? g.timeSecs : 0), // 파이값
        timeSecs: Math.max(0, Number.isFinite(g.timeSecs) ? g.timeSecs : 0), // 표시용
      })),
    [goals],
  );

  const total = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  const hasAny = total > 0;

  return (
    <Wrap>
      <ChartRow $pct={chartWidthPct}>
        <ChartBox>
          <ClockPie24 goals={goals} size={240} padAngle={0} />
        </ChartBox>

        <Legend>
          {data.length === 0 || !hasAny ? (
            <Empty>{emptyText}</Empty>
          ) : (
            data.map(g => (
              <LegendItem key={g.id}>
                <ColorDot style={{ background: g.color }} />
                <span className="typo-h4" style={{ lineHeight: "1.1", wordBreak: "keep-all" }}>
                  {g.label}
                </span>
                <span className="time" style={{ color: "var(--text-3)" }}>
                  {fmtHMS(g.timeSecs)}
                </span>
              </LegendItem>
            ))
          )}
        </Legend>
      </ChartRow>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
`;

const ChartRow = styled.div<{ $pct: number }>`
  display: grid;
  grid-template-columns: ${({ $pct }) => `${$pct}%`} 1fr;
  gap: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  padding: 8px 0;
`;

const Legend = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 12px;
  margin-top: 14px;
`;

const LegendItem = styled.span`
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 12px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  .time {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 14px;
  }
`;

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
`;

const Empty = styled.div`
  padding: 12px;
  color: var(--gray-500);
  background: var(--gray-50);
  border-radius: 12px;
`;
