import React, { useState } from "react";

import { ChatType } from "../types/Chat";

const dummyDate = [
  ["1", "2", "3"],
  ["1", "2", "3"],
  ["1", "2", "3"],
];

export const useChatForm = () => {
  const [userChat, setUserChat] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [buttonTexts, setButtonTexts] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [chats, setChats] = useState<ChatType[]>([
    {
      writer: "chatbot",
      content: [
        "안녕! 난 공부 계획을 짜주고 다양한 목표를 달성할 수 있도록 도와주는 'Rana'라고해. 네가 계획을 세우고 목표를 달성할 때마다 나는 우물 밖 세상을 구경할 수 있어",
        "우선 너가 해야 할 일을 알려주면 관련 정보를 알려주고 공부 계획을 짜줄게!",
        "나와 함께 우물 밖으로 나갈 준비 됐어?",
      ],
    },
  ]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userChat.trim()) return;
    const newUserChatInfo = {
      writer: "user" as const,
      content: userChat,
    };
    const nextChatbotChatInfo = {
      writer: "chatbot" as const,
      content: dummyDate[count],
    };
    setChats(prev => [...prev, newUserChatInfo, nextChatbotChatInfo]);
    setUserChat("");
    if (count + 1 === 3) {
      setStatus(prev => !prev);
      setButtonTexts(["계획 확정 짓기", "잠깐, 수정할래!"]);
    }
    console.log(count);
    setCount(prev => prev + 1);
  };

  return {
    userChat,
    chats,
    status,
    count,
    buttonTexts,
    setUserChat,
    setStatus,
    setCount,
    handleSubmit,
  };
};
