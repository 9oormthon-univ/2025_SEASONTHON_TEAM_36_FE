import { useRef, useState } from "react";
import styled from "styled-components";

import detailsTri from "@/assets/images/details-tri.svg";
import trashIcon from "@/assets/images/trash.svg";

import ConfirmModal from "../../../common/components/ConfirmModal";
import PageModal from "../../../common/components/PageModal";
import FrogBar from "../components/FrogBar";
import StepDetailsPopup from "../components/StepDetailsPopup";
import { useAutoCenterList } from "../hooks/useAutoCenterList";
import { useConfirmGoalDelete } from "../hooks/useConfirmGoalDelete";
import { useGoalStepsView } from "../hooks/useGoalStepsView";
import { useActiveGoalStore } from "../store/useActiveGoalStore";
import { DDayIcon } from "../styles/DDayIcon";
import { StepViewItem } from "../types/steps";

interface GoalStepsModalProps {
  open: boolean;
  onClose?: () => void;
  onDelete?: (goalId: number | string) => void;
  onDeleted?: () => void;
}

export default function GoalStepsModal({
  open,
  onClose,
  onDelete,
  onDeleted,
}: GoalStepsModalProps) {
  // 0) 활성 goalId (Zustand)
  const activeId = useActiveGoalStore(s => s.activeId);

  // 1) 데이터 로딩 (store의 activeId 사용)
  const { vm, loading, error } = useGoalStepsView(open, activeId);

  // 2) 스크롤 중앙정렬 측정
  const stepsRef = useRef<HTMLUListElement | null>(null);
  const centerList = useAutoCenterList(stepsRef, open, `${vm.steps.length}-${open}`);

  // 3) 삭제
  const { confirmOpen, deleting, openConfirm, closeConfirm, handleConfirmDelete } =
    useConfirmGoalDelete({ goalId: activeId, onDelete, onDeleted, onClose });

  // 4) 상세 팝업
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<StepViewItem | null>(null);
  const openDetails = (step: StepViewItem) => {
    setSelectedStep(step);
    setDetailOpen(true);
  };
  const closeDetails = () => setDetailOpen(false);

  return (
    <PageModal title="" open={open} onClose={onClose} headerVariant="back-left" viewNavBar>
      <Body>
        <HeaderWrapper>
          <Header>
            <HeaderGroup>
              <DDayIcon className="typo-body-xs">{loading ? "…" : vm.dDay}</DDayIcon>
              <DueDate>마감일: {loading ? "…" : vm.endDate}</DueDate>

              <DeleteButton
                type="button"
                title="삭제"
                onClick={openConfirm}
                aria-haspopup="dialog"
                aria-busy={deleting}
                disabled={!!(loading || error || deleting) || activeId == null}
              >
                <img src={trashIcon} alt="삭제" />
              </DeleteButton>
            </HeaderGroup>
          </Header>

          <Title className="typo-h2">{loading ? "불러오는 중…" : vm.title}</Title>
          <WarmMsg>{loading ? "" : vm.progressText}</WarmMsg>
        </HeaderWrapper>

        <Content role="region" aria-label="단계 진행 영역">
          <FrogWrap>
            <FrogBar progress={loading ? 0 : vm.progress} />
          </FrogWrap>

          <Steps ref={stepsRef} role="list" aria-label="진행 단계 목록" $center={centerList}>
            {(loading ? [] : vm.steps).map(s => (
              <StepItem key={s.stepId ?? `${s.stepDate}-${s.description}`} role="listitem">
                <StepDate className="typo-body-s">{s.stepDate}</StepDate>
                <StepTitleRow>
                  <StepTitle>{s.description}</StepTitle>
                  <DetailsBtn type="button" aria-label="자세히 보기" onClick={() => openDetails(s)}>
                    <img src={detailsTri} alt="" aria-hidden="true" />
                  </DetailsBtn>
                </StepTitleRow>
              </StepItem>
            ))}
            {!loading && vm.steps.length === 0 && (
              <div style={{ padding: 12, color: "#6F737B" }}>등록된 스텝이 없습니다.</div>
            )}
          </Steps>
        </Content>
      </Body>

      <ConfirmModal
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        message={deleting ? "삭제 중..." : "정말 삭제하겠습니까?"}
        confirmText={deleting ? "삭제 중" : "삭제"}
        cancelText="취소"
      />
      <StepDetailsPopup open={detailOpen} onClose={closeDetails} step={selectedStep} />
    </PageModal>
  );
}

// ---------- styled components ----------
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
  color: var(--text-2, #6f737b);
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
const Steps = styled.ul<{ $center: boolean }>`
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
  ${({ $center }) => ($center ? "justify-content: center;" : "justify-content: flex-start;")}
`;

const StepItem = styled.li`
  display: flex;
  width: 92%;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 16px;
  background: var(--surface-1, var(--natural-0, #fff));
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
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
