// src/pages/home/components/TodayStepsList.tsx
import styled from "styled-components";

import type { StepListItem } from "../../types/steps"; // ← 공용 타입 재사용(경로는 프로젝트 구조에 맞게)
import StepActionBtn from "./StepActionBtn";

type TimeMap = Partial<Record<string | number, Date | string>>;

interface TodayStepsListProps {
  items: StepListItem[];
  onAction?: (it: { id: string | number; stepId: number | null }) => void | Promise<void>;
  startTimes?: TimeMap;
  endTimes?: TimeMap;
}

export default function TodayStepsList({
  items = [],
  onAction,
  startTimes = {},
  endTimes = {},
}: TodayStepsListProps) {
  return (
    <List role="list">
      {items.map(it => {
        const isPlaying = it.state === "play";
        const startedAt = startTimes?.[it.id] ?? null;
        const endedAt = endTimes?.[it.id] ?? null;

        return (
          <Item key={it.id} role="listitem">
            <Bullet aria-hidden="true" />
            {/* StepViewItem은 title이 아니라 description을 사용합니다 */}
            <ItemTitle>{it.description}</ItemTitle>

            <Right>
              {(startedAt || endedAt) && (
                <Times aria-label="시작/종료 시간">
                  {startedAt && <TimeBadge>시작: {formatHM(startedAt)}</TimeBadge>}
                  {startedAt && endedAt && <Separator aria-hidden="true">·</Separator>}
                  {endedAt && <TimeBadge>종료: {formatHM(endedAt)}</TimeBadge>}
                </Times>
              )}

              <StepActionBtn
                isPlaying={isPlaying}
                onClick={() => {
                  void onAction?.({ id: it.id, stepId: it.stepId });
                }}
                size={29}
              />
            </Right>
          </Item>
        );
      })}
    </List>
  );
}

/* HH:MM 포맷터 */
function formatHM(dateOrString: Date | string): string {
  const d = dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  if (Number.isNaN(d.getTime())) return "--:--";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 20px;
  margin-top: 4%;
  padding: 0;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 0 2.3% 3.5% 2.3%;
  background: transparent;
  border-bottom: 1px solid var(--natural-400, #d6d9e0);
`;

const Bullet = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--icon-1);
  margin-right: 15px;
`;

const ItemTitle = styled.div`
  color: var(--text-1, #000);
  font-size: var(--fs-lg, 16px);
  font-weight: 500;
  line-height: 100%;
  letter-spacing: var(--ls-2, 0);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Times = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const TimeBadge = styled.span`
  font-size: 10px;
  line-height: 1;
  color: var(--text-2);
  background: var(--natural-200, #eef3ee);
  border: 1px solid var(--bg-2, #e6e8ec);
  padding: 2px 4px;
  border-radius: 4px;
`;

const Separator = styled.span`
  display: inline-block;
  padding: 0 2px;
  opacity: 0.7;
`;
