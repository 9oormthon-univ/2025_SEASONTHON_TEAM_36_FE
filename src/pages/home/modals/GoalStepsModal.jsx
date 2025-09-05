import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";
import { DDayIcon } from "../styles/DDayIcon";
import trashIcon from "@/assets/images/trash.svg";
import FrogBar from "../components/FrogBar";
import detailsTri from "@/assets/images/details-tri.svg";
import ConfirmModal from "../../../common/components/ConfirmModal";
import { fetchSteps } from "@/apis/step";

export default function GoalStepsModal({ open, onClose, goalId, onDelete }) {
  const [steps, setSteps] = React.useState(null);      // 서버 원본
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // 서버 데이터 로드 
  React.useEffect(() => {
    if (!open || goalId == null) return; // 모달 열릴 때만 호출
    let alive = true;
    setLoading(true);
    setError(null);

    fetchSteps(goalId)
      .then((data) => {
        if (!alive) return;
        setSteps(data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [open, goalId]);

  // 화면에 데이터를 표시하기 위한 뷰 모델 
  const view = React.useMemo(() => {
    const s = steps || {};
    return {
      dday: s.dDay ?? "D-0",
      title: s.title ?? "",
      endDate: s.endDate ?? "-",
      progressText: s.progressText ?? "",
      progress: Number.isFinite(+s.progress) ? +s.progress : 0,
      steps: Array.isArray(s.steps) ? s.steps : [],
    };
  }, [steps]);

  /** 스크롤 필요 여부를 감지해서 Steps 중앙 정렬 여부 결정 */
  const stepsRef = React.useRef(null);
  const [centerList, setCenterList] = React.useState(true); // 기본: 중앙 정렬

  React.useLayoutEffect(() => {
    const el = stepsRef.current;
    if (!el) return;

    let rafId = 0;
    let ro = null;
    let mo = null;

    const measure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // 레이아웃이 확정된 다음 프레임에서 측정
        const hasOverflow = el.scrollHeight > el.clientHeight + 1;
        setCenterList(!hasOverflow);
      });
    };

    // 초기 2프레임 측정 (폰트/이미지 로딩 영향 흡수)
    measure();
    rafId = requestAnimationFrame(measure);

    // 컨테이너/상위 크기 변화 감지
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      if (el.parentElement) ro.observe(el.parentElement);
    }

    // 자식 추가/삭제/텍스트 변경 감지
    mo = new MutationObserver(measure);
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    // 윈도우 리사이즈
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(rafId);
      ro && ro.disconnect();
      mo && mo.disconnect();
    };
  }, [view.steps.length, open]);

  // 삭제 확인 모달 제어
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const handleConfirmDelete = async () => {
    try {
      await onDelete?.(goalId);
    } finally {
      setConfirmOpen(false);
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
              <DDayIcon className="typo-body-xs">{loading ? "…" : view.dday}</DDayIcon>
              <DueDate>마감일: {loading ? "…" : view.endDate}</DueDate>

              <DeleteButton type="button" title="삭제" onClick={openConfirm} aria-haspopup="dialog" disabled={loading || error}>
                <img src={trashIcon} alt="삭제" />
              </DeleteButton>
            </HeaderGroup>
          </Header>

          <Title className="typo-h2">{loading ? "불러오는 중…" : view.title}</Title>
          <WarmMsg>{loading ? "" : view.progressText}</WarmMsg>
        </HeaderWrapper>

        <Content role="region" aria-label="단계 진행 영역">
          <FrogWrap>
            <FrogBar progress={loading ? 0 : view.progress} />
          </FrogWrap>

          <Steps
            ref={stepsRef}
            role="list"
            aria-label="진행 단계 목록"
            $center={centerList} 
          >
            {(loading ? [] : view.steps).map((s) => (
              <StepItem key={s.stepOrder} role="listitem">
                <StepDate className="typo-body-s">{s.stepDate}</StepDate>
                <StepTitleRow>
                  <StepTitle>{s.description}</StepTitle>
                  <DetailsBtn type="button" aria-label="자세히 보기">
                    <img src={detailsTri} alt="" aria-hidden="true" />
                  </DetailsBtn>
                </StepTitleRow>
              </StepItem>
            ))}
            {!loading && view.steps.length === 0 && (
                <div style={{ padding: 12, color: "#6F737B" }}>등록된 스텝이 없습니다.</div>
              )}
          </Steps>
        </Content>
      </Body>

      <ConfirmModal
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
  min-height: 0; /* 스크롤 컨테이너 전파 */
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
  min-height: 0; /* 스크롤 컨테이너 전파 */
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

const Steps = styled.ul`
  flex: 1 1 auto;
  height: 100%;     /* 스크롤 영역 명시 */
  min-height: 0;    /* 부모 기준 높이 전파 */
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
  background: var(--surface-1, var(--natural-0, #FFF));
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