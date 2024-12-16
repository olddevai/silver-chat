export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (fileName: string): 'image' | 'document' => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return imageExtensions.includes(ext) ? 'image' : 'document';
};