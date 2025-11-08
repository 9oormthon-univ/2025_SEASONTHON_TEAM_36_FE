// import "./styles/chat.css";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserChatButton from "@/assets/images/chat-button.svg";
import EscapeFrogImg from "@/assets/images/frog-escape-new.svg";
import ConfirmModal from "@/common/components/ConfirmModal";
import FrogNoti from "@/common/components/FrogNoti";
import PageModal, { ModalHeader } from "@/common/components/PageModal";

import { Chatbot, User } from "./components/Chat";
import Choice from "./components/Choice";
import { useChatForm } from "./hooks/useChatForm";
import { useChatScroll } from "./hooks/useChatScroll";
import { Button, Form, Input, Page } from "./styles";
import { ChatBody, ChatbotChatBlock, ChatDate } from "./styles/Chat";
import { getKoreanDay } from "./utils/date";

const ChatbotPage = () => {
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [splashOpen, setSplashOpen] = useState<boolean>(false);

  useChatScroll(ref);
  const { userChat, chats, status, buttonTexts, setUserChat, setStatus, setCount, handleSubmit } =
    useChatForm();

  return (
    <>
      <PageModal
        open={splashOpen}
        onClose={() => {
          setSplashOpen(false);
          setCount(0);
          setStatus(false);
        }}
      >
        <FrogNoti
          topText={"개구리가 우물을 탈출할\n계획을 짜고 있어요"}
          imageSrc={EscapeFrogImg}
          bottomText={"조금만 기다려 주세요..."}
        />
      </PageModal>

      <Page>
        <ConfirmModal
          open={modalOpen}
          onConfirm={() => {
            void navigate("/home");
          }}
          onCancel={() => {
            setModalOpen(false);
          }}
          message={`대화를 종료하시겠어요?\n지금 대화를 그만두면 다시 이어서\n대화할 수 없어요`}
          cancelText="계속할래요"
          confirmText="그만할래요"
          cancelCentric={true}
        />
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
          {status && (
            <Choice
              setSplashOpen={setSplashOpen}
              setStatus={setStatus}
              setCount={setCount}
              buttonTexts={buttonTexts}
            />
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
            />
            <Button>
              <img src={UserChatButton} alt="채팅 버튼" />
            </Button>
          </Form>
        )}
      </Page>
    </>
  );
};

export default ChatbotPage;
