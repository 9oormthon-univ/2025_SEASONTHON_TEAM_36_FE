import { useEffect } from "react";

export const useChatScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    const chatBody = ref.current;

    const scrollToBottom = () => {
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          scrollToBottom();
        }
      }
    });

    scrollToBottom();

    observer.observe(chatBody, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, [ref]);
};
