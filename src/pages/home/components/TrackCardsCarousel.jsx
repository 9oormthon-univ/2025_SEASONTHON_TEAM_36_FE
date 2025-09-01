import React, { useState } from "react";
import styled from "styled-components";
import SwipeCarousel from "./SwipeCarousel";
import DotIndicator from "./DotIndicator";

export default function TaskCardsCarousel({ cards = [] }) {
  const [index, setIndex] = useState(0);

  return (
    <Wrap>
      <SwipeCarousel index={index} onIndexChange={setIndex}>
        {cards.map((card, i) => (
          <div key={i}>{card}</div>
        ))}
      </SwipeCarousel>

      <IndicatorRow>
        <DotIndicator index={index} />
      </IndicatorRow>
    </Wrap>
  );
}

const Wrap = styled.div` width: 100%; `;
const IndicatorRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`;
