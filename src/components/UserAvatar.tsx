import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
}

export const UserAvatar: React.FC<Props> = ({ 
  user, 
  size = 'md',
  showOnlineStatus = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-primary-100 flex items-center justify-center`}>
          <span className="text-primary-700 font-medium">
            {user.displayName[0].toUpperCase()}
          </span>
        </div>
      )}
      {showOnlineStatus && (
        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
          user.online ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};