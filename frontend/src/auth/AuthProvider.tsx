import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';

export interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // There is most definitely a better way of doing this instead of calling it every single time. I just CBS for now
  const { user, isAuthenticated } = useCurrentUser();

  const value = { user, isAuthenticated };
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


