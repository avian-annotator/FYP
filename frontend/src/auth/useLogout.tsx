import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface LogoutResponse {
  success?: string
  error?: string
}

const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'

// TODO: CSRF!!!!!!!!
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await axios.post<LogoutResponse>(
        `${backendUrl}/api/logout`,
        {},
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
      await queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] })
      window.location.href = '/'
    },
  })
}
