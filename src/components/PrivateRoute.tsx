import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;