import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName,
        photoURL: '',
        online: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        online: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await setDoc(doc(db, 'users', uid), {
          online: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
      }
      await firebaseSignOut(auth);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
};