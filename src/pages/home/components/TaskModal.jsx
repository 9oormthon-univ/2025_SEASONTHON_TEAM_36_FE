import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";

import playIcon from "@/assets/images/play.svg";
import pauseIcon from "@/assets/images/pause.svg";

export default function TaskModal() {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  const groups = [
    {
      id: "today",
      title: "우물 밖으로 나갈 준비",
      defaultOpen: true,
      items: [
        { id: 1, title: "LG 전자 과거 마케팅사례 조사하기", state: "pause" },
        { id: 2, title: "LG 전자제품 선정하기", state: "play" },
      ],
    },
    {
      id: "carried",
      title: "이월된 일",
      defaultOpen: true,
      items: [
        { id: 3, title: "선정한 제품 자료조사하기", state: "play" },
        { id: 4, title: "텍스트", state: "idle" },
        { id: 5, title: "텍스트", state: "play" },
        { id: 6, title: "텍스트", state: "idle" },
      ],
    },
  ];

  return (
    <>
      <BottomSheet
        open={open}
        onOpen={openSheet}
        onClose={closeSheet}
        ariaLabel="할 일 목록"
        peekHeight={50}
        size="56vh"
      >
        <SheetBody>
          <TopBar>
            <CloseDownBtn onClick={closeSheet} aria-label="내려서 닫기">
              <img src={arrowDown} alt="arrow-down" width={14} style={{ height: "auto" }} />
            </CloseDownBtn>
          </TopBar>

          <ScrollArea role="list">
            {groups.map((g) => (
              <Section key={g.id} title={g.title} defaultOpen={g.defaultOpen}>
                <List>
                  {g.items.map((it) => (
                    <Item key={it.id}>
                      <Bullet aria-hidden="true" />
                      <ItemTitle>{it.title}</ItemTitle>
                      <Right>
                        <PlayBtn
                          type="button"
                          aria-label={it.state === "play" ? "중지" : "시작"}
                          $state={it.state}
                        >
                          <IconImg
                            src={it.state === "pause" ? pauseIcon : playIcon}
                            alt=""
                            aria-hidden="true"
                          />
                        </PlayBtn>
                      </Right>
                    </Item>
                  ))}
                </List>
              </Section>
            ))}
          </ScrollArea>
        </SheetBody>
      </BottomSheet>
    </>
  );
}

/* ============== Section(헤더-컨텐츠) 컴포넌트 ============== */
function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <SectionWrap>
      <SectionHeader className="typo-h3" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Chevron $open={open} aria-hidden="true">▾</Chevron>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>

      <SectionContent $open={open}>
        <div>{children}</div>
      </SectionContent>
    </SectionWrap>
  );
}

/* ============== styled-components ============== */

const SheetBody = styled.div`
  display: flex; flex-direction: column; height: 100%; max-height: 100%; overflow: hidden;
  margin: 0 2%;
`;

const TopBar = styled.div`
  position: sticky; top: 0; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  border-bottom: 1px solid var(--surface-2);
`;

const CloseDownBtn = styled.button`
  position: absolute; right: 8px; top: 6px;
  appearance: none; border: 0; background: transparent; cursor: pointer;
  color: var(--text-2); font-size: 18px; line-height: 1;
  padding: 0 6px;
  margin: 0 1% 0 0;
  border-radius: 8px;
  &:hover { background: var(--surface-2); }
`;

const ScrollArea = styled.div`
  overflow: auto; padding: 4px 8px 12px;
`;

/* --- Section --- */
const SectionWrap = styled.section`
  background: var(--bg-1);
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--surface-2) inset;
  margin: 8px 0 12px;
`;

const SectionHeader = styled.button`
  width: 100%; appearance: none; border: 0; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  background: transparent;
  color: var(--text-1);
`;

const Chevron = styled.span`
  display: inline-block; transition: transform 180ms ease;
  transform: rotate(${(p) => (p.$open ? 0 : -90)}deg);
`;

const SectionTitle = styled.h3`
  margin: 0; font-size: 16px; font-weight: 800; letter-spacing: -0.2px; color: var(--text-1);
`;

const SectionContent = styled.div`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? "1fr" : "0fr")};
  transition: grid-template-rows 220ms ease;
  > div { overflow: hidden; }
`;

/* --- List + Item --- */
const List = styled.ul`
  list-style: none;
  display: grid; gap: 20px;
  margin-top: 4%; 
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
  width: 6px; height: 6px; border-radius: 9999px; background: var(--icon-1);
  margin-right: 15px;
`;

const ItemTitle = styled.div`
  color: var(--text-1, #000);
  font-size: var(--fs-lg, 16px);
  font-weight: 500;
  line-height: 100%; /* 16px */
  letter-spacing: var(--ls-2, 0);
`;

const Right = styled.div`
  display: inline-flex; align-items: center; gap: 8px;
`;

const PlayBtn = styled.button`
  appearance: none; border: 0; cursor: pointer;
  background: transparent; 
  display: inline-flex; align-items: center; justify-content: center;
`;

/* 아이콘 크기 고정 */
const IconImg = styled.img`
  width: 29px;
  height: 29px;
  display: block;
`;
