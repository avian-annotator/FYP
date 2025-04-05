import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCurrentUser = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/current_user`,
          { withCredentials: true } // This is critical for session cookies
        );
        return res.data;
      } catch (error) {
        // Return a default unauthenticated response instead of throwing
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return { authenticated: false };
        }
        throw error; // Rethrow other errors
      }
    },
  }
  );
  return {
    user: data?.user,
    isAuthenticated: !!data?.authenticated,
    isLoading
  };

}