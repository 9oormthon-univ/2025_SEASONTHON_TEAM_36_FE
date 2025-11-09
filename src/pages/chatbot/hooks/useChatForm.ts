import { EventSourcePolyfill } from "event-source-polyfill";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendMessage } from "@/apis/ai";
import { getUserProfile } from "@/apis/user";
import { RespUserProfile } from "@/common/types/response/user";
import { getAccessToken } from "@/common/utils/token";

import { ChatType } from "../types/Chat";

export const useChatForm = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<RespUserProfile>();
  const [userChat, setUserChat] = useState<string>("");
  const [chatbotLoading, setChatbotLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<boolean>(false);
  const [buttonTexts, _] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const chatbotRef = useRef<EventSourcePolyfill | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const isClosingRef = useRef<boolean>(false); // 의도적인 연결 종료 플래그
  const visitedRef = useRef<boolean>(false);

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
                  Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN as string}`,
                  Accept: "text/event-stream",
                },
              },
            );

            chatbotRef.current.onmessage = (event: MessageEvent) => {
              if (!isMounted) return;

              if (event.data === "✅ 응답 완료") {
                return;
              }

              if (!event.data) return;
              if (
                isMounted &&
                visitedRef.current &&
                event.data ===
                  "안녕! 🐸\n나는 함께 공부계획을 세워주는 개구리 ‘Rana’야!\n너가 목표를 세우고 달성할 때마다 나는 우물 밖 세상을 구경할 수 있어.\n나랑 함께 점프해볼래? 준비됐어?"
              ) {
                return;
              } else {
                visitedRef.current = true;
              }

              let messageData = String(event.data);

              // (todoId=<숫자>) 패턴을 감지하는 정규표현식
              const todoIdPattern = /^(.+)\n\(TodoId=(\d+)\)$/;
              const match = messageData.match(todoIdPattern);
              if (match && match[1] && match[2]) {
                messageData = match[1].trim();
                const todoId = parseInt(match[2], 10);
                // todoId를 사용한 추가 로직을 여기에 구현
                setTimeout(() => {
                  void navigate("/chatbot/result", {
                    state: {
                      todoId: todoId,
                    },
                  });
                }, 3000);
              }

              const newChatbotChatInfo = {
                writer: "chatbot" as const,
                content: messageData,
              };
              setChats(prev => [...prev, newChatbotChatInfo]);
              setChatbotLoading(false);
            };

            chatbotRef.current.onerror = errorEvent => {
              if (!isMounted) return;

              // 의도적인 연결 종료인 경우
              if (isClosingRef.current) {
                setLoading(false);
                return;
              }

              // errorEvent가 undefined인 경우는 타임아웃 또는 재연결 시도
              if (!errorEvent || errorEvent === undefined) {
                console.warn(
                  "SSE connection timeout detected - closing connection to prevent duplicate messages",
                );
                // 타임아웃 발생 시 연결을 명시적으로 종료하여 재연결 방지
                if (chatbotRef.current) {
                  isClosingRef.current = true;
                  chatbotRef.current.close();
                  chatbotRef.current = null;
                }
                setLoading(false);
                return;
              }

              // 실제 에러가 발생한 경우
              console.error("SSE error:", errorEvent);
              // 심각한 에러인 경우에만 에러 상태 설정
              if (errorEvent && typeof errorEvent === "object" && "status" in errorEvent) {
                const eventWithStatus = errorEvent as { status: number };
                const status = eventWithStatus.status;
                // 4xx, 5xx 에러인 경우에만 에러로 처리
                if (status >= 400) {
                  setIsError(true);
                }
              }
              setLoading(false);
            };

            chatbotRef.current.onopen = () => {
              if (!isMounted) return;
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
        isClosingRef.current = true; // 의도적인 종료임을 표시
        chatbotRef.current.close();
        chatbotRef.current = null;
      }
    };
  }, [navigate]);

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
          setChatbotLoading(true);
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
    chatbotLoading,
    setChatbotLoading,
    isError,
    setIsError,
    chatbotRef,
    isClosingRef,
  };
};
