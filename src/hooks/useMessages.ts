import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { Message } from '../types';

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (text: string, senderId: string) => {
    await addDoc(collection(db, 'messages'), {
      chatId,
      text,
      senderId,
      timestamp: serverTimestamp(),
      status: 'sent',
      type: 'text'
    });
  };

  const updateMessageStatus = async (messageId: string, status: 'delivered' | 'read') => {
    await updateDoc(doc(db, 'messages', messageId), { status });
  };

  return {
    messages,
    loading,
    sendMessage,
    updateMessageStatus
  };
};