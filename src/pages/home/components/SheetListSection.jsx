// Section.jsx
import React from "react";
import styled from "styled-components";

/**
 * Collapsible Section
 * - title: 헤더 텍스트
 * - defaultOpen?: 초기 오픈 여부 (기본 true)
 * - className?: 외부 스타일 확장용
 */
export default function SheetListSection({ title, defaultOpen = true, className, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const labelId = React.useId();
  const contentId = React.useId();

  return (
    <SectionWrap className={className}>
      <SectionHeader
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        id={labelId}
      >
        <Chevron $open={open} aria-hidden="true">▾</Chevron>
        <SectionTitle className="typo-h3">{title}</SectionTitle>
      </SectionHeader>

      <SectionContent
        $open={open}
        id={contentId}
        role="region"
        aria-labelledby={labelId}
      >
        <div>{children}</div>
      </SectionContent>
    </SectionWrap>
  );
}

const SectionWrap = styled.section`
  background: var(--bg-1);
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--surface-2) inset;
  margin: 8px 0 12px;
`;

const SectionHeader = styled.button`
  width: 100%;
  appearance: none;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-1);
`;

const Chevron = styled.span`
  display: inline-block;
  transition: transform 180ms ease;
  transform: rotate(${(p) => (p.$open ? 0 : -90)}deg);
  font-size: var(--fs-xl, 20px);
`;

const SectionTitle = styled.h3`
  color: var(--text-1);
`;

const SectionContent = styled.div`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? "1fr" : "0fr")};
  transition: grid-template-rows 220ms ease;
  > div { overflow: hidden; }
`;
