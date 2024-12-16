import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useChats } from '../hooks/useChats';
import { UserAvatar } from './UserAvatar';
import { User } from '../types';

interface Props {
  onSelectUser: (user: User) => void;
}

export const SearchUsers: React.FC<Props> = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const { searchUsers } = useChats('');

  useEffect(() => {
    const search = async () => {
      if (searchTerm.length >= 3) {
        const users = await searchUsers(searchTerm);
        setResults(users);
      } else {
        setResults([]);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers]);

  return (
    <div className="p-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((user) => (
            <div
              key={user.uid}
              onClick={() => onSelectUser(user)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
            >
              <UserAvatar user={user} size="sm" showOnlineStatus />
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};