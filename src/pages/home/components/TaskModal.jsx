import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";
import ListSection from "./ListSection";
import TaskList from "./TaskList";

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
              <ListSection key={g.id} title={g.title} defaultOpen={g.defaultOpen}>
                <TaskList
                  items={g.items}
                // onAction={(item) => console.log("clicked:", item)} // 필요 시 사용
                />
              </ListSection>
            ))}
          </ScrollArea>
        </SheetBody>
      </BottomSheet>
    </>
  );
}

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