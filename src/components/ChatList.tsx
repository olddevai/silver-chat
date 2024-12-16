import React from 'react';
import { format } from 'date-fns';
import { useChats } from '../hooks/useChats';
import { useAuthStore } from '../store/authStore';

export const ChatList: React.FC<{
  onSelectChat: (chatId: string) => void;
}> = ({ onSelectChat }) => {
  const { user } = useAuthStore();
  const { chats, loading } = useChats(user?.uid || '');

  if (loading) {
    return <div className="p-4">Loading chats...</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {chat.isGroup ? (
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700">{chat.groupName?.[0]}</span>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
            )}
            <div className="flex-1">
              <h3 className="font-medium">
                {chat.isGroup ? chat.groupName : 'User Name'}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {chat.lastMessage?.timestamp &&
                format(chat.lastMessage.timestamp, 'HH:mm')}
            </div>
          </div>
          {chat.unreadCount > 0 && (
            <div className="ml-auto mt-1">
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};