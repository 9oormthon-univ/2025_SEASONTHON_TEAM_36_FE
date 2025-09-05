import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";
import { DDayIcon } from "../styles/DDayIcon";
import trashIcon from "@/assets/images/trash.svg";
import FrogBar from "../components/FrogBar";
import detailsTri from "@/assets/images/details-tri.svg";
import ConfirmMoal from "../../../common/components/ConfirmModal";

/** !!! API !!! 하드코딩된 steps 포함 샘플 데이터 */
const SAMPLE = {
  dDay: "D-10",
  title: "우물밖개구리 프로젝트",
  endDate: "2025-09-05",
  progressText: "개구리가 햇빛을 보기 시작했어요!",
  progress: 50,
  steps: [
    { stepDate: "2025-09-02", stepOrder: 1, description: "ToDo ERD 설계", count: 0, isCompleted: false },
    { stepDate: "2025-09-03", stepOrder: 2, description: "ToDo ERD 설계2", count: 0, isCompleted: false },
    { stepDate: "2025-09-04", stepOrder: 3, description: "ToDo ERD 설계3", count: 0, isCompleted: false },
    { stepDate: "2025-09-05", stepOrder: 4, description: "ToDo ERD 설계4", count: 0, isCompleted: false },
    { stepDate: "2025-09-05", stepOrder: 5, description: "ToDo ERD 설계5", count: 0, isCompleted: false },
    { stepDate: "2025-09-06", stepOrder: 6, description: "ToDo ERD 설계6", count: 0, isCompleted: false },
  ],
};

export default function GoalStepsModal({ open, onClose, goalId, onDelete }) {
  // goalId를 이용해 데이터를 가져왔다고 가정
  const view = React.useMemo(() => {
    const g = SAMPLE;
    return {
      dday: g.dday ?? g.dDay,
      dueDate: g.dueDate ?? g.endDate,
      title: g.title,
      warmMessage: g.warmMessage ?? g.progressText,
      progress: Number.isFinite(+g.progress) ? +g.progress : 0,
      steps: g.steps ?? [],
    };
  }, [goalId]);

  /** 스크롤 필요 여부를 감지해서 Steps 중앙 정렬 여부 결정 */
  const stepsRef = React.useRef(null);
  const [centerList, setCenterList] = React.useState(true); // 기본: 중앙 정렬

  React.useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;

    const compute = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 1;
      setCenterList(!hasOverflow);
    };

    compute();

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(compute);
      ro.observe(el);
    }
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("resize", compute);
      if (ro) ro.disconnect();
    };
  }, [view.steps.length]);

  // 삭제 확인 모달 제어
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const handleConfirmDelete = async () => {
    // 외부에서 전달된 삭제 콜백 실행
    try {
      await onDelete?.(goalId);
    } finally {
      setConfirmOpen(false);
      // 삭제 후 현재 모달 닫기(선택)
      onClose?.();
    }
  };

  return (
    <PageModal open={open} onClose={onClose} headerVariant="back-left" viewNavBar>
      {/* 모달 내부 레이아웃 루트 (헤더 위, 컨텐츠 아래) */}
      <Body>
        <HeaderWrapper>
          <Header>
            <HeaderGroup>
              <DDayIcon className="typo-body-xs">{view.dday ?? "D-0"}</DDayIcon>
              <DueDate>마감일: {view.dueDate ?? "-"}</DueDate>

              {/* ✅ 삭제 버튼 → 확인 모달 오픈 */}
              <DeleteButton type="button" title="삭제" onClick={openConfirm} aria-haspopup="dialog">
                <img src={trashIcon} alt="삭제" />
              </DeleteButton>
            </HeaderGroup>
          </Header>

          <Title className="typo-h2">{view.title}</Title>
          <WarmMsg>{view.warmMessage}</WarmMsg>
        </HeaderWrapper>

        {/* 헤더 '아래'에 배치되는 스크롤 컨텐츠 */}
        <Content role="region" aria-label="단계 진행 영역">
          <FrogWrap>
            <FrogBar progress={view.progress} />
          </FrogWrap>

          <Steps
            ref={stepsRef}
            role="list"
            aria-label="진행 단계 목록"
            $center={centerList}   // ✅ 스크롤 없을 때만 중앙 정렬
          >
            {view.steps.map((s) => (
              <StepItem key={s.stepOrder} role="listitem">
                <StepDate className="typo-body-s">{s.stepDate}</StepDate>

                {/* 타이틀 + 아이콘 한 줄 */}
                <StepTitleRow>
                  <StepTitle>{s.description}</StepTitle>
                  <DetailsBtn type="button" aria-label="자세히 보기">
                    <img src={detailsTri} alt="" aria-hidden="true" />
                  </DetailsBtn>
                </StepTitleRow>
              </StepItem>
            ))}
          </Steps>
        </Content>
      </Body>

      {/* 삭제 확인 모달 */}
      <ConfirmMoal
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        message="정말 삭제하겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </PageModal>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
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
  color: var(--text-2, #6F737B);
  font-size: var(--fs-lg, 16px);
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
  color: var(--text-2, #6F737B);
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
  display: flex;
  align-items: stretch;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  min-height: 0;
  gap: 12%;
`;

const FrogWrap = styled.div`
  flex: 0 0 10vw;
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const Steps = styled.ul`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 5%;
  min-width: 0;

  padding: 1.5%;
  padding-block: calc(1.5% + 12px);
  scroll-padding-top: 12px;
  scroll-padding-bottom: 12px;

  overflow-y: auto;
  overscroll-behavior: contain;

  ${({ $center }) => ($center ? "justify-content: center;" : "justify-content: flex-start;")}
`;

const StepItem = styled.li`
  display: flex;
  width: 92%;
  padding: 3% 8%;
  flex-direction: column;
  align-items: flex-start;
  gap: 5%;
  border-radius: 16px;
  background: var(--natural-0, #FFF);
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #D6D9E0),
     0.3px  0.3px 5px 0 var(--natural-400, #D6D9E0);
`;

const StepDate = styled.span`
  color: var(--text-2, #333);
  white-space: nowrap;
`;

const StepTitleRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const StepTitle = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-1, #000);
  font-size: var(--fs-xs, 12px);
  font-weight: 500;
  line-height: var(--lh-S, 16px);
  letter-spacing: var(--ls-1, 0.6px);
`;

const DetailsBtn = styled.button`
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
  }
`;
