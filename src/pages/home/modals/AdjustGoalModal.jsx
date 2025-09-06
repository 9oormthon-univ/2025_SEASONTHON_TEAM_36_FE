import React from "react";
import styled from "styled-components";

import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import { ModalContainer } from "../styles/ModalContainer";

/**
 * 목표 조정 모달
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, dday, title, progress, warmMessage }
 */
export default function AdjustGoalModal({ open, onClose, goalId }) {

  return (
    <PageModal
      open={open}
      onClose={onClose}
      headerVariant="close-right"
      viewNavBar
    >
      <ModalContainer>
        <Section>
          <Heading className="typo-h2">재도약하기</Heading>
          <Desc>
            실패는 성공의 어머니예요. 좌절하지 말고
            <br />
            목표량을 줄여보거나 기한을 늘려보세요
          </Desc>
        </Section>

        <Section
          style={{ borderBottom: "1px solid var(--natural-400)", paddingBottom: "10px" }}>
          <Heading className="typo-h2">목표량 재조정</Heading>
          <Textarea
            className="typo-body-m"
            placeholder={
              "완료해야 할 일을 상세하게 작성해주세요!\n\nex)\n메가커피 마케팅 전략 조사 및 새로운 전략 도출\n  ppt 10장 내로\n  SWOT 조사 필수"
            }
            maxLength={1000}
          />
          <CharCount>0/1000</CharCount>
        </Section>

        <Section>
          <Label className="typo-h3">기한 재조정</Label>
          <DeadlineInput>
            <input type="number" min="1" placeholder="0" />
            <span>일 추가</span>
          </DeadlineInput>
        </Section>

        <ButtonRow>
          <GreenButton>RESTART</GreenButton>
        </ButtonRow>
      </ModalContainer>
    </PageModal>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const Heading = styled.h2`
display: flex;
flex-direction: column;
justify-content: center;
align-self: stretch;
color: var(--text-1, #000);
`;

const Desc = styled.p`
display: flex;
flex-direction: column;
justify-content: center;
align-self: stretch;

color: var(--text-2, #6F737B);

font-size: var(--fs-lg, 16px);
font-style: normal;
font-weight: 500;
line-height: var(--lh-m, 24px); /* 150% */
letter-spacing: var(--ls-2, 0);
`;

const Label = styled.h3`
  color: var(--text-1, #000);
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  resize: vertical;
  padding: 12px;

  border-radius: 4px;
  border: 0.5px solid var(--natural-400);
  background: var(--bg-1);

  &::placeholder {
    color: var(--natural-800, #6F737B);
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 16px;
  color: var(--text-3);
`;

const DeadlineInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2%;
  gap: 5%;
  input {
    width: 30%;
    padding: 8px;
    border-radius: 2px;
    border: 1px solid var(--natural-400);
    text-align: center;
    font-size: 14px;
    color: var(--text-1);
    background: var(--bg-1);
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