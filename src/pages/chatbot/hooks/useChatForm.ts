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
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
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
                  Authorization: `Bearer ${getAccessToken()}`,
                  Accept: "text/event-stream",
                },
              },
            );

            chatbotRef.current.onmessage = (event: MessageEvent) => {
              if (!isMounted) return;
              console.info("SSE message received:", event.data);

              if (isReconnecting) {
                console.info("Message received during reconnection - ignoring");
                return;
              }

              if (event.data === "✅ 응답 완료") {
                return;
              }

              if (!event.data) return;

              let messageData = String(event.data);

              // (todoId=<숫자>) 패턴을 감지하는 정규표현식
              const todoIdPattern = /^(.+)\n\(TodoId=(\d+)\)$/;
              const match = messageData.match(todoIdPattern);
              if (match && match[1] && match[2]) {
                messageData = match[1].trim();
                const todoId = parseInt(match[2], 10);
                console.info("TodoId detected:", todoId);
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
              setChatbotLoading(prev => !prev);
            };

            chatbotRef.current.onerror = _ => {
              if (!isMounted) return;

              // 의도적인 연결 종료가 아닌 경우에만 에러로 처리
              if (!isClosingRef.current) {
                console.error("SSE error:", event);

                // EventSourcePolyfill의 에러 이벤트는 커스텀 구조를 가집니다
                const errorEvent = event as Event & {
                  type?: string;
                  target?: EventSourcePolyfill;
                  error?: Error;
                };

                // readyState를 먼저 확인 (상태 변경 전에 캡처)
                const currentReadyState = errorEvent.target?.readyState;
                console.info("ReadyState at error:", currentReadyState);

                if (errorEvent.error) {
                  console.error("Error details:", errorEvent.error.message);

                  // "Reconnecting" 메시지가 포함되어 있으면 재연결 상태로 설정
                  if (errorEvent.error.message.includes("Reconnecting")) {
                    setIsReconnecting(true);
                    console.info("SSE is reconnecting...");
                  }
                }

                // readyState 설명:
                // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
                if (currentReadyState === 2) {
                  console.info("Connection is CLOSED");
                } else if (currentReadyState === 0) {
                  console.info("Connection is CONNECTING (likely reconnecting)");
                } else if (currentReadyState === 1) {
                  console.info("Connection is OPEN");
                }

                // setIsError(true);
              } else {
                console.info("SSE connection closed intentionally");
              }
              setLoading(false);
            };

            chatbotRef.current.onopen = () => {
              if (!isMounted) return;
              console.info("SSE connection opened");
              if (isReconnecting) {
                console.info("Reconnection successful - was in reconnecting state");
              }
              setLoading(false);
              setIsReconnecting(false); // 연결 성공 시 재연결 상태 해제
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
  }, [isReconnecting, navigate]);

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
          setChatbotLoading(prev => !prev);
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
    isReconnecting,
    setIsReconnecting,
    chatbotRef,
    isClosingRef,
  };
};
