import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { Chat, User } from '../types';

export const useChats = (userId: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      setChats(newChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const createChat = async (participants: string[], isGroup: boolean = false, groupName?: string) => {
    await addDoc(collection(db, 'chats'), {
      participants,
      isGroup,
      groupName,
      createdAt: serverTimestamp(),
      lastMessage: null,
      unreadCount: 0
    });
  };

  const searchUsers = async (searchTerm: string): Promise<User[]> => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as User));
  };

  return {
    chats,
    loading,
    createChat,
    searchUsers
  };
};