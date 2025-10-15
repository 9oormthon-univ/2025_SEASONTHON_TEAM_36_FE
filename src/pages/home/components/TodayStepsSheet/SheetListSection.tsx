import React from "react";
import styled from "styled-components";

/**
 * - title: 헤더 텍스트
 * - className?: 외부 스타일 확장용
 */
export default function SheetListSection({
  title,
  className,
  children,
}: {
  title: string | undefined;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <SectionWrap className={className}>
      <SectionHeader>
        <SectionTitle className="typo-h3">{title}</SectionTitle>
      </SectionHeader>

      <SectionContent>
        <div>{children}</div>
      </SectionContent>
    </SectionWrap>
  );
}

const SectionWrap = styled.section`
  background: var(--bg-1);
  border-radius: 12px;
  margin: 8px 0 12px;
`;

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-1);
  margin: 8px 22px;
`;

const SectionTitle = styled.h3`
  color: var(--text-1);
`;

const SectionContent = styled.div`
  > div {
    overflow: visible;
  }
`;
