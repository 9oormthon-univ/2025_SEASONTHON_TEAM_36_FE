import "./styles/chat.css";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserChatButton from "@/assets/images/chat-button.svg";
import { ModalHeader } from "@/common/components/PageModal";

import { Chatbot, User } from "./components/Chat";
import { useChatForm } from "./hooks/useChatForm";
import { useChatScroll } from "./hooks/useChatScroll";
import { Button, ChatBody, ChatDate, Form, Input, Page } from "./styles";
import { ChatType } from "./types/Chat";
import { getKoreanDay } from "./utils/date";

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [userChat, setUserChat] = useState("");
  const [chats, setChats] = useState<ChatType[]>([
    {
      writer: "chatbot",
      content:
        "안녕! 난 공부 계획을 짜주고 다양한 목표를 달성할 수 있도록 도와주는 'Rana'라고해. 네가 계획을 세우고 목표를 달성할 때마다 나는 우물 밖 세상을 구경할 수 있어",
    },
  ]);
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();

  useChatScroll(ref);
  const { handleSubmit } = useChatForm(userChat, setUserChat, setChats);

  return (
    <Page>
      <ModalHeader
        variant="back-left"
        title="Rana"
        onClose={() => {
          void navigate(-1);
        }}
      />
      <ChatBody ref={ref}>
        <ChatDate>{`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${getKoreanDay(today)}요일`}</ChatDate>
        {chats.map((chatInfo, index) =>
          chatInfo.writer === "chatbot" ? (
            <Chatbot key={index}>{chatInfo.content}</Chatbot>
          ) : (
            <User key={index}>{chatInfo.content}</User>
          ),
        )}
      </ChatBody>
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
    </Page>
  );
};

export default ChatbotPage;
