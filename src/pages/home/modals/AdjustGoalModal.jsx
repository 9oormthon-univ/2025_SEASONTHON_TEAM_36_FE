import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";
import GreenButton from "../../../common/components/GreenButton";

/**
 * 목표 조정 모달
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, dday, title, progress, warmMessage }
 */
export default function AdjustGoalModal({ open, onClose, goal }) {
  if (!goal) return null;

  return (
    <PageModal
      open={open}
      onClose={onClose}
      headerVariant="close-right"
    >
       <Container>
      <Section>
        <Heading>재도약하기</Heading>
        <Desc>
          실패는 성공의 어머니예요. 좌절하지 말고
          <br />
          목표량을 줄여보거나 기한을 늘려보세요
        </Desc>
      </Section>

      <Section>
        <Label>목표량 재조정</Label>
        <Textarea
          placeholder={
            "완료해야 할 일을 상세하게 작성해주세요\nex)\n• 메가커피 마케팅 전략 조사 및 새로운 전략 도출하기\n• ppt 10장 내로\n• SWOT 조사 필수"
          }
          maxLength={1000}
        />
        <CharCount>0/1000</CharCount>
      </Section>

      <Section>
        <Label>기한 재조정</Label>
        <DeadlineInput>
          <input type="number" min="1" placeholder="0" />
          <span>일 추가</span>
        </DeadlineInput>
      </Section>

      <ButtonRow>
        <GreenButton>RESTART</GreenButton>
      </ButtonRow>
    </Container>
    </PageModal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: var(--bg-1);
  color: var(--text-1);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Heading = styled.h2`
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 700;
`;

const Desc = styled.p`
  font-size: clamp(12px, 3vw, 14px);
  color: var(--text-2);
  line-height: 1.5;
`;

const Label = styled.label`
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 600;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  resize: vertical;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 8px;
  border: 1px solid var(--surface-2);
  color: var(--text-1);
  background: var(--surface-1);

  &::placeholder {
    color: var(--text-3);
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: var(--text-3);
`;

const DeadlineInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: 64px;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--surface-2);
    text-align: center;
    font-size: 14px;
    color: var(--text-1);
    background: var(--surface-1);
  }

  span {
    font-size: 14px;
    color: var(--text-1);
  }
`;

const ButtonRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;