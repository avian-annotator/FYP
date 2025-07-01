import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LogoutResponse {
  success?: string;
  error?: string;
}

// TODO: CSRF!!!!!!!!
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // This is important
          },
          withCredentials: true,
          responseType: "json",
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the currentUser query to refetch the user's authentication state
      queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
    },
  });
};
