import React, { useState, useRef } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface Props {
  onSendMessage: (text: string) => void;
  onSendFile: (file: File) => void;
}

export const ChatInput: React.FC<Props> = ({ onSendMessage, onSendFile }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, progress } = useFileUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Paperclip size={20} />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Image size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 text-primary-500 hover:text-primary-600 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      {progress > 0 && progress < 100 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-primary-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </form>
  );
};