import { EventSourcePolyfill } from "event-source-polyfill";
import React, { useEffect, useRef, useState } from "react";

import { sendMessage } from "@/apis/ai";
import { getUserProfile } from "@/apis/user";
import { RespUserProfile } from "@/common/types/response/user";

import { ChatType } from "../types/Chat";

export const useChatForm = () => {
  const [userInfo, setUserInfo] = useState<RespUserProfile>();
  const [userChat, setUserChat] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [buttonTexts, _] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const chatbotRef = useRef<EventSourcePolyfill | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const isClosingRef = useRef<boolean>(false); // 의도적인 연결 종료 플래그

  useEffect(() => {
    let isMounted = true;

    const initSSEConnection = async () => {
      try {
        const respUserInfo = await getUserProfile();

        if (!isMounted) return;

        if (typeof respUserInfo === "object" && "userId" in respUserInfo) {
          setUserInfo(respUserInfo);

          // 기존 연결이 있다면 먼저 종료
          if (chatbotRef.current) {
            chatbotRef.current.close();
            chatbotRef.current = null;
          }

          try {
            chatbotRef.current = new EventSourcePolyfill(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/ai/connect?userId=${respUserInfo.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                  Accept: "text/event-stream",
                },
              },
            );

            chatbotRef.current.onmessage = (event: MessageEvent) => {
              if (!isMounted) return;
              console.info("SSE message received:", event.data);
              if (event.data === "✅ 응답 완료") {
                return;
              }
              const newChatbotChatInfo = {
                writer: "chatbot" as const,
                content: event.data as string,
              };
              setChats(prev => [...prev, newChatbotChatInfo]);
            };

            chatbotRef.current.onerror = (error: Event) => {
              if (!isMounted) return;

              // 의도적인 연결 종료가 아닌 경우에만 에러로 처리
              if (!isClosingRef.current) {
                console.error("SSE error:", error);
                // setIsError(true);
              } else {
                console.info("SSE connection closed intentionally");
              }
              setLoading(false);
            };

            chatbotRef.current.onopen = () => {
              if (!isMounted) return;
              console.info("SSE connection opened");
              setLoading(false);
              isClosingRef.current = false; // 연결이 열리면 플래그 초기화
            };
          } catch (error) {
            console.error("Failed to create EventSource:", error);
            // setIsError(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(error);
        // setIsError(true);
        setLoading(false);
      }
    };

    void initSSEConnection();

    // cleanup 함수: 컴포넌트 언마운트 또는 재렌더링 시 연결 종료
    return () => {
      isMounted = false;
      if (chatbotRef.current) {
        console.info("Closing SSE connection");
        isClosingRef.current = true; // 의도적인 종료임을 표시
        chatbotRef.current.close();
        chatbotRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sentUserChat = userChat.trim();
    if (userInfo) {
      sendMessage(userInfo.userId, sentUserChat)
        .then(_ => {
          const newUserChatInfo = {
            writer: "user" as const,
            content: sentUserChat,
          };
          setChats(prev => [...prev, newUserChatInfo]);
          setUserChat("");
        })
        .catch(error => console.error(error));
    }
    if (!sentUserChat) return;
  };

  return {
    userInfo,
    userChat,
    chats,
    status,
    buttonTexts,
    setUserChat,
    setStatus,
    handleSubmit,
    loading,
    setLoading,
    isError,
    setIsError,
    chatbotRef,
    isClosingRef,
  };
};
