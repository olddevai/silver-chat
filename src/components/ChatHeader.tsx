import React from 'react';
import { MoreVertical, Phone, Video } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { Chat, User } from '../types';
import { formatLastSeen } from '../utils/dateUtils';

interface Props {
  chat: Chat;
  recipient?: User;
}

export const ChatHeader: React.FC<Props> = ({ chat, recipient }) => {
  return (
    <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {chat.isGroup ? (
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700">{chat.groupName?.[0]}</span>
          </div>
        ) : recipient && (
          <UserAvatar user={recipient} showOnlineStatus />
        )}
        <div>
          <h2 className="font-medium">
            {chat.isGroup ? chat.groupName : recipient?.displayName}
          </h2>
          {!chat.isGroup && recipient && (
            <p className="text-sm text-gray-500">
              {recipient.online ? 'Online' : `Last seen ${formatLastSeen(recipient.lastSeen)}`}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <Video size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};