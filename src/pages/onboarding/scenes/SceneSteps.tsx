import { useState } from "react";
import styled from "styled-components";

import detailsTri from "@/assets/images/details-tri.svg";
import trashIcon from "@/assets/images/trash.svg";
import { StepViewItem } from "@/pages/home/types/steps";

import OnbFrogBar from "../components/OnbFrogBar";

const todaySteps: StepViewItem[] = [
  {
    stepId: 1,
    stepOrder: 1,
    stepDate: "2025-00-00",
    description: "자서전에 경험 후보 정리하기",
    isCompleted: false,
  },
  {
    stepId: 2,
    stepOrder: 2,
    stepDate: "2025-00-00",
    description: "자서전의 전체 흐름과 목차 결정하기",
    isCompleted: false,
  },
  {
    stepId: 3,
    stepOrder: 3,
    stepDate: "2025-00-00",
    description: "서론+어린시절 작성하기",
    isCompleted: false,
  },
  {
    stepId: 4,
    stepOrder: 4,
    stepDate: "2025-00-00",
    description: "본문 작성하기",
    isCompleted: false,
  },
  {
    stepId: 5,
    stepOrder: 5,
    stepDate: "2025-00-00",
    description: "결론 작성하기",
    isCompleted: false,
  },
  {
    stepId: 6,
    stepOrder: 6,
    stepDate: "2025-00-00",
    description: "글 검토하고 맞춤법 검사하기",
    isCompleted: false,
  },
];
interface SceneStepsProps {
  open: boolean;
  onClose?: () => void;
}

export default function SceneSteps() {
  // 4) 아코디언 확장 상태 (여러개 동시 확장 가능)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const getKey = (s: StepViewItem) => String(s.stepId ?? `${s.stepDate}-${s.description}`);
  const toggleExpand = (s: StepViewItem) => {
    const k = getKey(s);
    setExpanded(prev => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <Body>
      <HeaderWrapper>
        <Header>
          <HeaderGroup>
            <DDayIcon>D-7</DDayIcon>
            <DueDate>마감일: 2025-00-00</DueDate>

            <DeleteButton type="button" title="삭제" aria-haspopup="dialog">
              <img src={trashIcon} alt="삭제" />
            </DeleteButton>
          </HeaderGroup>
        </Header>

        <Title className="typo-h3">자서전 작성하기</Title>
        <WarmMsg>우물에 햇빛이 들기 시작했어요!</WarmMsg>
      </HeaderWrapper>

      <Content role="region" aria-label="단계 진행 영역">
        <FrogWrap>
          <OnbFrogBar progress={45} />
        </FrogWrap>

        <Steps role="list" aria-label="진행 단계 목록">
          {todaySteps.map(s => {
            const key = getKey(s);
            const isOpen = !!expanded[key];
            const panelId = `step-panel-${key}`;
            return (
              <StepItem key={key} role="listitem" aria-expanded={isOpen}>
                <StepDate className="typo-body-s">{s.stepDate}</StepDate>

                <StepTitleRow $expanded={isOpen}>
                  <StepTitle $expanded={isOpen}>{s.description}</StepTitle>
                  <DetailsBtn
                    type="button"
                    aria-label={isOpen ? "자세히 닫기" : "자세히 보기"}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleExpand(s)}
                    $expanded={isOpen}
                    title={isOpen ? "접기" : "펼치기"}
                  >
                    <img src={detailsTri} alt="" aria-hidden="true" />
                  </DetailsBtn>
                </StepTitleRow>

                {/* 아코디언 패널 영역 */}
                <StepPanel id={panelId} $open={isOpen} role="region" aria-label="단계 상세">
                  <PanelGrid>
                    <PanelRow>
                      <PanelLabel>완료 여부</PanelLabel>
                      <PanelValue>
                        {"isCompleted" in s && typeof s.isCompleted === "boolean" ? (
                          <StatusPill data-completed={s.isCompleted}>
                            {s.isCompleted ? "완료" : "미완료"}
                          </StatusPill>
                        ) : (
                          "-"
                        )}
                      </PanelValue>
                    </PanelRow>
                  </PanelGrid>
                </StepPanel>
              </StepItem>
            );
          })}
        </Steps>
      </Content>
    </Body>
  );
}
const DDayIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 38px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--text-1);
  font-size: clamp(8px, 2.5vw, 15px);
  font-weight: 400;
  background: var(--green-200);
`;
// ---------- styled components ----------
const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--bg-2);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 12px 0 16px;
`;

const Header = styled.header`
  width: 72vw;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DueDate = styled.span`
  color: var(--text-2, #6f737b);
  font-size: 14px;
  font-weight: 500;
  line-height: var(--lh-l, 100%);
  letter-spacing: var(--ls-2, 0);
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  img {
    width: 24px;
    height: auto;
    display: block;
  }
`;

const Title = styled.h2`
  color: var(--text-1, #000);
  text-align: center;
  margin: 0;
`;

const WarmMsg = styled.p`
  color: var(--text-2, #6f737b);
  font-size: var(--fs-xs, 12px);
  font-weight: 400;
  line-height: var(--lh-l, 140%);
  letter-spacing: var(--ls-2, 0);
  text-align: center;
  margin: 0;
`;

const Content = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  gap: 12%;
`;

const FrogWrap = styled.div`
  flex: 0 0 10vw;
  max-width: 120px;
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

// Transient prop $center 로 타입 안전하게 처리
const Steps = styled.ul`
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 5%;
  min-width: 0;
  padding: 12px;
  scroll-padding-top: 12px;
  scroll-padding-bottom: 12px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const StepItem = styled.li`
  display: flex;
  width: 90%;
  padding: 8px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  border-radius: 16px;
  background: var(--natural-0, #fff);
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
`;

const StepDate = styled.span`
  color: var(--text-2, #333);
  white-space: nowrap;
`;

// 확장 상태에 맞춰 수직 정렬 조금 바꿔주면 제목이 여러 줄일 때 보기 좋아짐
const StepTitleRow = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  width: 100%;
  gap: 8px;
`;

// 핵심: 확장 여부에 따라 말줄임/전체 표시를 토글
const StepTitle = styled.span<{ $expanded?: boolean }>`
  flex: 1 1 auto;
  min-width: 0;
  color: var(--text-1, #000);
  font-size: var(--fs-xs, 12px);
  font-weight: 500;
  line-height: var(--lh-S, 16px);
  letter-spacing: var(--ls-1, 0.6px);

  /* 기본(접힘): 한 줄 + ellipsis */
  ${({ $expanded }) =>
    !$expanded
      ? `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `
      : `
    /* 확장: 전체 표시 (여러 줄 래핑) */
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    line-height: var(--lh-M, 18px);
    word-break: keep-all;
    overflow-wrap: anywhere;
  `}
`;

const DetailsBtn = styled.button<{ $expanded: boolean }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    display: block;
    filter: var(--icon, none);
    transform: rotate(${({ $expanded }) => ($expanded ? 90 : 0)}deg);
    transition: transform 160ms ease;
  }
`;

/** 아코디언 패널: 높이 애니메이션(max-height) + opacity */
const StepPanel = styled.div<{ $open: boolean }>`
  width: 100%;
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "400px" : "0px")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    max-height 220ms ease,
    opacity 200ms ease;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: ${({ $open }) => ($open ? "10px" : "0")};
  margin-top: ${({ $open }) => ($open ? "2px" : "0")};
`;

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  row-gap: 6px;
  column-gap: 10px;
  width: 100%;
`;

const PanelRow = styled.div`
  display: contents;
`;

const PanelLabel = styled.span`
  color: var(--text-2, #6f737b);
  font-size: 12px;
  line-height: 18px;
`;

const PanelValue = styled.span`
  color: var(--text-1, #111);
  font-size: 13px;
  line-height: 18px;
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  line-height: 18px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.06);
  &[data-completed="true"] {
    background: #e8f5e9;
    color: #2e7d32;
  }
  &[data-completed="false"] {
    background: #fff3e0;
    color: #e65100;
  }
`;
