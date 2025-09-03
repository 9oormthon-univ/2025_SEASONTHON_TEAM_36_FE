import React from "react";
import styled from "styled-components";
import playIcon from "@/assets/images/play.svg";
import pauseIcon from "@/assets/images/pause.svg";

/**
 * TaskList
 * - items: [{ id, title, state: "play" | "pause" | "idle" }]
 * - onAction?: (item) => void  // 버튼 클릭 시 콜백 (선택)
 */
export default function StepsList({ items = [], onAction }) {
  return (
    <List role="list">
      {items.map((it) => {
        const isPlaying = it.state === "play";
        const aria = isPlaying ? "중지" : "시작";
        const iconSrc = isPlaying ? pauseIcon : playIcon;

        return (
          <Item key={it.id} role="listitem">
            <Bullet aria-hidden="true" />
            <ItemTitle>{it.title}</ItemTitle>
            <Right>
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
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
