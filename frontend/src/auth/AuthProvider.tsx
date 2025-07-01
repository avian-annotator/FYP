import React, { createContext, useContext, ReactNode } from 'react';
import { useGetCurrentUser } from '../../generated'

export interface AuthContextType {
  user: string | undefined;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { data, isLoading, isError } = useGetCurrentUser({ withCredentials: true });
  let isAuthenticated = false;
  if (!isError && !isLoading) {
    isAuthenticated = data?.authenticated ?? false;
  }

  const value = { user: data?.user, isAuthenticated };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};


