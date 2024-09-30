import { Chat } from "@/components/ChatList";
import { ChatMessage } from ".";

let currentChatId: number

export const chatService = {
  getChats: () => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    return chats;
  },

  getMessages: (chatId: number) => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    const chat = chats.find((chat: Chat) => chat.id === chatId);
    return chat ? chat.messages : [];
  },

  addChat: (newChat: Chat) => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    chats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(chats));
  },

  setCurrentChatId: (chatId: number) => {
    currentChatId = chatId
  },

  updateChat: (newMessage: ChatMessage) => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    const updatedChats = chats.map((chat: Chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    );
    console.log(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats));
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
