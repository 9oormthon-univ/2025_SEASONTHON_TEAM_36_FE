import { useEffect } from "react";

interface UseChatScrollProps {
  ref: React.RefObject<HTMLDivElement | null>;
  dependency?: unknown;
}

export const useChatScroll = (
  refOrProps: React.RefObject<HTMLDivElement | null> | UseChatScrollProps,
) => {
  // 이전 방식과의 호환성을 위해 ref만 전달된 경우와 객체로 전달된 경우 모두 처리
  const ref = "current" in refOrProps ? refOrProps : refOrProps.ref;
  const dependency = "current" in refOrProps ? undefined : refOrProps.dependency;

  useEffect(() => {
    if (!ref.current) return;

    const chatBody = ref.current;

    const scrollToBottom = () => {
      // 즉시 스크롤 (smooth 제거 - 더 확실한 스크롤을 위해)
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    // DOM이 완전히 렌더링된 후 스크롤 실행
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [ref, dependency]);
};
