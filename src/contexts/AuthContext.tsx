import React, { createContext, useContext, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext<any>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(
          userDoc,
          {
            online: true,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [setUser]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}