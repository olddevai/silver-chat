import { formatDistanceToNow, format } from 'date-fns';

export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'HH:mm');
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d, HH:mm');
  }
  
  return format(date, 'MMM d, yyyy HH:mm');
};

export const formatLastSeen = (timestamp: number): string => {
  return formatDistanceToNow(timestamp, { addSuffix: true });
};