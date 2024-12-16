import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export const useTyping = (chatId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const typingRef = doc(db, 'typing', chatId);
    let timeout: NodeJS.Timeout;

    const unsubscribe = onSnapshot(typingRef, (doc) => {
      const data = doc.data();
      if (data && data.userId !== userId) {
        setOtherUserTyping(data.isTyping);
      }
    });

    return () => {
      unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [chatId, userId]);

  const setTypingStatus = async (typing: boolean) => {
    if (!chatId) return;

    setIsTyping(typing);
    await setDoc(doc(db, 'typing', chatId), {
      userId,
      isTyping: typing,
      timestamp: Date.now()
    });
  };

  return {
    isTyping,
    otherUserTyping,
    setTypingStatus
  };
};