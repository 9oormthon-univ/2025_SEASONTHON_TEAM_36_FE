// import "./styles/chat.css";

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { disconnectSSE } from "@/apis/ai";
import UserChatButton from "@/assets/images/chat-button.svg?react";
import ConfirmModal from "@/common/components/ConfirmModal";
import { ModalHeader } from "@/common/components/PageModal";

import { Chatbot, User } from "./components/Chat";
import { useChatForm } from "./hooks/useChatForm";
import { useChatScroll } from "./hooks/useChatScroll";
import { Button, Form, Input, Page } from "./styles";
import { ChatBody, ChatbotChat, ChatbotChatBlock, ChatDate } from "./styles/Chat";
import { getKoreanDay } from "./utils/date";

const ChatbotPage = () => {
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {
    userInfo,
    userChat,
    chats,
    status,
    setUserChat,
    handleSubmit,
    loading,
    chatbotLoading,
    isError,
    isClosingRef,
    // chatbotRef,
  } = useChatForm();

  // chats 배열이 변경될 때마다 스크롤
  useChatScroll({ ref, dependency: chats });

  // ConfirmModal 핸들러를 useCallback으로 메모이제이션
  const handleConfirmClose = useCallback(() => {
    if (userInfo && isClosingRef) {
      isClosingRef.current = true; // 의도적인 종료임을 표시
      disconnectSSE(userInfo.userId)
        .then(_ => void navigate("/home"))
        .catch(error => console.error(error));
    }
  }, [userInfo, navigate, isClosingRef]);

  const handleCancelClose = useCallback(() => {
    setModalOpen(false);
  }, []);
  console.log(chatbotLoading);
  return (
    <>
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
        message={`대화를 종료하시겠어요?\n지금 대화를 그만두면 다시 이어서\n대화할 수 없어요`}
        cancelText="계속할래요"
        confirmText="그만할래요"
        cancelCentric={true}
      />
      <Page>
        {loading ? (
          "불러오는 중..."
        ) : isError ? (
          "챗봇 연결을 실패했습니다 🥲"
        ) : (
          <>
            <ModalHeader
              variant="back-left"
              title="Rana"
              onClose={() => {
                if (!modalOpen) {
                  setModalOpen(true);
                }
              }}
            />
            <ChatBody ref={ref}>
              <ChatDate>{`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${getKoreanDay(today)}요일`}</ChatDate>
              {chats.map((chatInfo, index) =>
                chatInfo.writer === "chatbot" ? (
                  <Chatbot key={index}>
                    {Array.isArray(chatInfo.content) ? (
                      chatInfo.content.map((value, index) => (
                        <ChatbotChatBlock key={index}>{value}</ChatbotChatBlock>
                      ))
                    ) : (
                      <ChatbotChatBlock style={{ padding: "10px 15px" }}>
                        {chatInfo.content}
                      </ChatbotChatBlock>
                    )}
                  </Chatbot>
                ) : (
                  <User key={index}>{chatInfo.content}</User>
                ),
              )}
              {chatbotLoading && (
                <Chatbot>
                  <ChatbotChat>
                    <div
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "var(--natural-200)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--natural-600)",
                          animation: "bounce 1.5s ease-in-out infinite",
                        }}
                      />
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--natural-600)",
                          animation: "bounce 1.5s ease-in-out 0.2s infinite",
                        }}
                      />
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--natural-600)",
                          animation: "bounce 1.5s ease-in-out 0.4s infinite",
                        }}
                      />
                    </div>
                  </ChatbotChat>
                </Chatbot>
              )}
            </ChatBody>
            {!status && (
              <Form onSubmit={handleSubmit}>
                <Input
                  value={userChat}
                  placeholder="메시지를 입력하세요."
                  onChange={e => {
                    setUserChat(e.target.value);
                  }}
                  disabled={chatbotLoading ? true : false}
                />
                <Button
                  onClick={e => {
                    if (chatbotLoading) {
                      e.preventDefault();
                    }
                  }}
                >
                  <UserChatButton className={chatbotLoading ? "disabled" : ""} />
                </Button>
              </Form>
            )}
          </>
        )}
      </Page>
    </>
  );
};

export default ChatbotPage;
