import { useState } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${path}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError(error.message);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  return {
    uploadFile,
    progress,
    error
  };
};