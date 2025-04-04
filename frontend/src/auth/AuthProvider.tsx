import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated] = useState<boolean>(false); // This should be set based on your authentication logic

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
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


