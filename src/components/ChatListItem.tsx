// src/components/ChatItem.tsx
import React from 'react';

type ChatListItemProps = {
  title: string;
  date: string;
};

const ChatListItem: React.FC<ChatListItemProps> = ({ title, date }) => {
  return (
    <div className="w-full">
      <a
        href="#"
        className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent/30 hover:text-accent-foreground px-4 py-2 w-full h-full justify-start mb-1"
      >
        <div className='line-clamp-2'>
          <p className='text-ellipsis whitespace-break-spaces overflow-hidden truncate line-clamp-2'>{title}</p>
          <div className="text-xs text-muted-foreground mt-1">{date}</div>
        </div>
      </a>
    </div>
  );
};

export default ChatListItem;
