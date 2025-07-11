import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginCredentials, LoginResponse, useLoginProps } from './AuthProvider'
import { use } from 'react'
import axios from 'axios'
import { AuthContext } from './authContext'

// TODO: CSRF!!!!!!!!
export const useLogin = ({ location }: useLoginProps) => {
  const queryClient = useQueryClient()
  const context = use(AuthContext)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const { username, password } = credentials

      // Create form data
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        formData.toString(), // Send as form data
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // This is important
          },
          withCredentials: true,
          responseType: 'json',
        },
      )

      return response.data
    },
    onSuccess: async () => {
      // Invalidate the currentUser query to refetch the user's authentication state
      await queryClient.invalidateQueries({ queryKey: ['useGetCurrentUser'] })
      if (location) {
        window.location.href = location
      }
      context?.setIsAuthenticated(true)
    },
  })
}
