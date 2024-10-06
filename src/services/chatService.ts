import { Chat } from "@/components/ChatList";
import { ChatMessage } from "../pages/playground";
import { v4 as uuidv4 } from "uuid";

let currentChatId: number;

export const chatService = {
  getChats: () => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    return chats;
  },

  getMessages: (chatId: number) => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    const chat = chats.find((chat: Chat) => chat.id === chatId);
    return chat ? chat.messages : [];
  },

  addChat: (newChat: Chat) => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    chats.push(newChat);
    localStorage.setItem("chats", JSON.stringify(chats));
  },

  setCurrentChatId: (chatId: number) => {
    currentChatId = chatId;
  },

  getCurrentChatId: () => {
    return currentChatId;
  },

  getUserId: () => {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }

    return userId;
  },

  updateChat: (newMessage: ChatMessage) => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    const updatedChats = chats.map((chat: Chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat,
    );
    localStorage.setItem("chats", JSON.stringify(updatedChats));
  },

  createNewChat: (title: string, newId: number | null) => {
    const newChat = {
      id: newId ? newId : Date.now(),
      title,
      messages: [],
    };
    chatService.addChat(newChat);
    return newChat;
  },
};
