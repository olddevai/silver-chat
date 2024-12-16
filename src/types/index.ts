export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  online: boolean;
  lastSeen: number;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileURL?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupPhoto?: string;
}