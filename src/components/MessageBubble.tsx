import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../types';
import { useAuthStore } from '../store/authStore';

interface Props {
  message: Message;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const { user } = useAuthStore();
  const isSender = message.senderId === user?.uid;

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isSender ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        {message.type === 'text' && <p>{message.text}</p>}
        {message.type === 'image' && (
          <img src={message.fileURL} alt="Shared image" className="rounded-lg max-w-full" />
        )}
        {message.type === 'file' && (
          <a
            href={message.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-500 hover:underline"
          >
            <span>{message.fileName}</span>
            <span className="text-sm">({message.fileSize} bytes)</span>
          </a>
        )}
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs opacity-75">
            {format(message.timestamp, 'HH:mm')}
          </span>
          {isSender && (
            <span className="text-xs">
              {message.status === 'sent' && <Check size={16} />}
              {message.status === 'delivered' && <CheckCheck size={16} />}
              {message.status === 'read' && (
                <CheckCheck size={16} className="text-blue-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};