import React, { useState, useEffect, useMemo } from 'react'
import { useGetCurrentUser } from '../../generated'
import { AuthContext } from './authContext'

export interface AuthProviderProps {
  children: React.ReactNode
}

export interface LoginResponse {
  success?: string
  error?: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export interface useLoginProps {
  location?: string
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Initial check to see if the user is authenticated (cookie is already present)
  const { data, isLoading, isError } = useGetCurrentUser(
    { withCredentials: true },
    { refetchOnMount: true, staleTime: 0, retry: false },
  )

  useEffect(() => {
    if (!isError && !isLoading) {
      setIsAuthenticated(data?.data.user != null)
    }
  }, [data, isLoading, isError])

  const value = useMemo(
    () => ({
      userDetails: data?.data,
      status: data?.status,
      statusText: data?.statusText,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [data, isAuthenticated, setIsAuthenticated],
  )

  return <AuthContext value={ value }>{ children }</AuthContext>
}
