import React, { useState } from 'react';
import { ChatList } from '../components/ChatList';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { SearchUsers } from '../components/SearchUsers';
import { ThemeToggle } from '../components/ThemeToggle';
import { TypingIndicator } from '../components/TypingIndicator';
import { useMessages } from '../hooks/useMessages';
import { useChats } from '../hooks/useChats';
import { useTyping } from '../hooks/useTyping';
import { useAuthStore } from '../store/authStore';
import { useFileUpload } from '../hooks/useFileUpload';
import { getFileType } from '../utils/fileUtils';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { messages, sendMessage, updateMessageStatus } = useMessages(selectedChat || '');
  const { chats, createChat } = useChats(user?.uid || '');
  const { uploadFile } = useFileUpload();
  const { otherUserTyping, setTypingStatus } = useTyping(selectedChat || '', user?.uid || '');

  const handleSendMessage = async (text: string) => {
    if (selectedChat && user) {
      await sendMessage(text, user.uid);
    }
  };

  const handleSendFile = async (file: File) => {
    if (selectedChat && user) {
      const fileURL = await uploadFile(file, `chats/${selectedChat}/files`);
      const fileType = getFileType(file.name);
      await sendMessage('', user.uid, {
        type: fileType,
        fileURL,
        fileName: file.name,
        fileSize: file.size
      });
    }
  };

  const handleUserSelect = async (selectedUser: any) => {
    const existingChat = chats.find(chat => 
      !chat.isGroup && chat.participants.includes(selectedUser.uid)
    );

    if (existingChat) {
      setSelectedChat(existingChat.id);
    } else {
      await createChat([user!.uid, selectedUser.uid]);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">Chats</h1>
          <ThemeToggle />
        </div>
        <SearchUsers onSelectUser={handleUserSelect} />
        <ChatList onSelectChat={setSelectedChat} />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              chat={chats.find(c => c.id === selectedChat)!}
              recipient={null} // Add user lookup logic
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {otherUserTyping && <TypingIndicator />}
            </div>
            <ChatInput
              onSendMessage={handleSendMessage}
              onSendFile={handleSendFile}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;