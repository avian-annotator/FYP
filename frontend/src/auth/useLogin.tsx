import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LoginResponse {
  success?: string;
  error?: string;

}

// TODO: CSRF!!!!!!!!
export const useLogin = (location?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }): Promise<LoginResponse> => {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

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

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the currentUser query to refetch the user's authentication state
      queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
      if (location) { window.location.href = location }
    
    },
  });
};
