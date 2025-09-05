import React from "react";
import styled from "styled-components";
import playIcon from "@/assets/images/play.svg";
import pauseIcon from "@/assets/images/pause.svg";

/**
 * TodayStepsList
 * - items: [{ id, title, state: "play" | "pause" | "idle" }]
 * - onAction?: (item) => void
 * - startTimes?: { [id:string]: Date | string }
 * - endTimes?:   { [id:string]: Date | string }
 */
export default function TodayStepsList({
  items = [],
  onAction,
  startTimes = {},
  endTimes = {},
}) {
  return (
    <List role="list">
      {items.map((it) => {
        const isPlaying = it.state === "play";
        const aria = isPlaying ? "중지" : "시작";
        const iconSrc = isPlaying ? pauseIcon : playIcon;

        const startedAt = startTimes?.[it.id] ?? null;
        const endedAt = endTimes?.[it.id] ?? null;

        return (
          <Item key={it.id} role="listitem">
            <Bullet aria-hidden="true" />
            <ItemTitle>{it.title}</ItemTitle>

            <Right>
              {(startedAt || endedAt) && (
                <Times aria-label="시작/종료 시간">
                  {startedAt && <TimeBadge>시작: {formatHM(startedAt)}</TimeBadge>}
                  {startedAt && endedAt && <Separator aria-hidden="true">·</Separator>}
                  {endedAt && <TimeBadge>종료: {formatHM(endedAt)}</TimeBadge>}
                </Times>
              )}

              <PlayBtn
                type="button"
                aria-label={aria}
                onClick={() => onAction?.(it)}
              >
                <IconImg src={iconSrc} alt="" aria-hidden="true" />
              </PlayBtn>
            </Right>
          </Item>
        );
      })}
    </List>
  );
}

/* HH:MM 포맷터 */
function formatHM(dateOrString) {
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
  border-bottom: 1px solid var(--natural-400, #D6D9E0);
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
  background: var(--natural-200, #EEF3EE);
  border: 1px solid var(--bg-2, #E6E8EC);
  padding: 2px 4px;
  border-radius: 4px;
`;

const Separator = styled.span`
  display: inline-block;
  padding: 0 2px;
  opacity: 0.7;
`;

const PlayBtn = styled.button`
  appearance: none;
  border: 0;
  cursor: pointer;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const IconImg = styled.img`
  width: 29px;
  height: 29px;
  display: block;
`;
