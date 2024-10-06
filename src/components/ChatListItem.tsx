import React from "react";
import { chatService } from "@/services/chatService";

type ChatListItemProps = {
  id: number;
  title: string;
  date: string;
};

const ChatListItem: React.FC<ChatListItemProps> = ({ id, title, date }) => {
  const currentChatId = chatService.getCurrentChatId()
  return (
    <div className="w-full px-2">
      <a
        href="#"
        className={`chat-list-item inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium hover:text-accent-foreground px-4 py-2 w-full h-full justify-start mb-1 ${
          id === currentChatId ? 'chat-list-item-selected' : ''
        }`}
      >
        <div className="line-clamp-2">
          <p className="text-ellipsis whitespace-break-spaces overflow-hidden truncate line-clamp-2">
            {title}
          </p>
          <div className="text-xs text-muted-foreground mt-1">{date}</div>
        </div>
      </a>
    </div>
  );
};

export default ChatListItem;
