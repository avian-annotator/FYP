import React, { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { CurrentUserResponseDTO, useGetCurrentUser } from '../../generated'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface AuthContextType {
  userDetails: CurrentUserResponseDTO | undefined;
  status?: number;
  statusText?: string;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginResponse {
  success?: string;
  error?: string;
}

export type LoginCredentials = {
  username: string;
  password: string;
};

export interface useLoginProps {
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initial check to see if the user is authenticated (cookie is already present)
  const { data, isLoading, isError } = useGetCurrentUser(
    { withCredentials: true },
    { refetchOnMount: true, staleTime: 0, retry: false }
  );

  useEffect(() => {
    if (!isError && !isLoading) {
      setIsAuthenticated(data?.data.user != null);
    }
  }, [data, isLoading, isError]);

  const value = {
    userDetails: data?.data,
    status: data?.status,
    statusText: data?.statusText,
    isAuthenticated,
    setIsAuthenticated
  };

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

// TODO: CSRF!!!!!!!!
export const useLogin = ({ location }: useLoginProps) => {
  const queryClient = useQueryClient()
  const context = useContext(AuthContext)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const { username, password } = credentials;

      // Create form data
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        formData.toString(), // Send as form data
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // This is important
          },
          withCredentials: true,
          responseType: "json",
        }
      );

      return response.data
    },
    onSuccess: () => {
      // Invalidate the currentUser query to refetch the user's authentication state
      queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
      if (location) { window.location.href = location }

      context?.setIsAuthenticated(true)
    },
  });
};




