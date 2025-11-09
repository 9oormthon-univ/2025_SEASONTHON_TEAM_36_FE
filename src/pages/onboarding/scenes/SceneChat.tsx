// src/pages/chat/SceneChat.tsx
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";

export default function SceneChat() {
  return (
    <Wrap>
      <MessageList>
        {Array.from({ length: 7 }).map((_, i) => (
          <MessageRow key={i} $isMyMessage={i % 2 === 1}>
            {i === 0 && (
              <>
                <AIIcon src={AI} alt="AI 개구리" />
                <BubbleGroup>
                  <SkeletonLine style={{ width: "140px" }} />
                  <SkeletonLine style={{ width: "120px" }} />
                  <SkeletonLine style={{ width: "160px" }} />
                  <SkeletonLine style={{ width: "100px" }} />
                </BubbleGroup>
              </>
            )}
            {i === 1 && <MyBubble style={{ width: "160px" }} />}
            {i === 2 && (
              <>
                <AIIcon src={AI} alt="AI 개구리" />
                <BubbleGroup>
                  <SkeletonLine style={{ width: "100px" }} />
                  <SkeletonLine style={{ width: "80px" }} />
                  <SkeletonLine style={{ width: "120px" }} />
                </BubbleGroup>
              </>
            )}
            {i === 3 && <MyBubble style={{ width: "100px" }} />}
            {i === 4 && (
              <>
                <AIIcon src={AI} alt="AI 개구리" />
                <BubbleGroup>
                  <SkeletonLine style={{ width: "140px" }} />
                  <SkeletonLine style={{ width: "120px" }} />
                </BubbleGroup>
              </>
            )}
            {i === 5 && <MyBubble style={{ width: "60px" }} />}
            {i === 6 && (
              <>
                <AIIcon src={AI} alt="AI 개구리" />
                <BubbleGroup>
                  <SkeletonLine style={{ width: "100px" }} />
                  <SkeletonLine style={{ width: "120px" }} />
                </BubbleGroup>
              </>
            )}
          </MessageRow>
        ))}
      </MessageList>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 24px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MessageRow = styled.div<{ $isMyMessage?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  ${({ $isMyMessage }) =>
    $isMyMessage &&
    `
    justify-content: flex-end;
  `}
`;

const AIIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const BubbleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
`;

const SkeletonLine = styled.div`
  height: 8px;
  background: var(--natural-400);
  border-radius: 4px;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
`;

const MyBubble = styled.div`
  width: 100px;
  height: 28px;
  border-radius: 12px 0 12px 12px;
  background: var(--green-100);
  align-self: flex-end;
`;
