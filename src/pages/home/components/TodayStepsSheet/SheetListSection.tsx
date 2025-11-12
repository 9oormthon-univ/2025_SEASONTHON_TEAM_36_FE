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
      <HeaderBackground>
        <SectionHeader>
          <SectionTitle className="typo-h3">{title}</SectionTitle>
        </SectionHeader>
      </HeaderBackground>

      <SectionContent>
        <div>{children}</div>
      </SectionContent>
    </SectionWrap>
  );
}

const SectionWrap = styled.section`
  background: transparent;
  border-radius: 12px;
  padding: 0 0 0 4px;
`;

const HeaderBackground = styled.div`
  position: sticky;
  top: 0; /* 또는 상단 고정 간격을 조절하려면 0 대신 4px, 8px 등 사용 */
  background: var(--bg-1, #fff); /* 투명 대신 배경색을 줘야 겹칠 때 가독성 유지 */
  color: var(--text-1);
  margin: 0 20px;
  padding: 4px 0;
`;

const SectionHeader = styled.div`
  color: var(--text-1);
`;

const SectionTitle = styled.h3`
  color: var(--text-1);
`;

const SectionContent = styled.div`
  overflow: hidden;
`;
