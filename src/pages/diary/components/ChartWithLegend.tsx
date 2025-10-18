import styled from "styled-components";

type Goal = {
  id: string | number;
  name: string;
  color: string; // e.g. "var(--green-200)"
};

interface ChartWithLegendProps {
  /** 원형 차트 이미지 경로 */
  chartSrc: string;
  /** 이미지 대체 텍스트 */
  chartAlt?: string;
  /** 범례에 표시할 목표 목록 */
  goals: Goal[];
  /** 차트 너비 비율 (기본 75%) */
  chartWidthPct?: number;
  className?: string;
}

export default function ChartWithLegend({
  chartSrc,
  chartAlt = "시간표",
  goals,
  chartWidthPct = 75,
  className,
}: ChartWithLegendProps) {
  return (
    <Wrapper className={className}>
      <ChartBox>
        <CircleChart
          src={chartSrc}
          alt={chartAlt}
          $widthPct={chartWidthPct}
          loading="lazy"
          decoding="async"
        />
      </ChartBox>

      <Legend>
        {goals.map(g => (
          <LegendItem key={g.id}>
            <LegendLeft>
              <ColorDot style={{ background: g.color }} />
              <span className="typo-h4">{g.name}</span>
            </LegendLeft>
          </LegendItem>
        ))}
      </Legend>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const CircleChart = styled.img<{ $widthPct: number }>`
  object-fit: cover;
  width: ${({ $widthPct }) => `${$widthPct}%`};
  max-width: 560px;
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 2px 0;
  color: var(--text-1);
`;

export const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  min-width: 0; /* ellipsis를 위해 필요 */
  > span {
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 64vw; /* 이름이 길 때 줄바꿈 대신 말줄임 */
  }
`;

export const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
`;
