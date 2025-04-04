import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLogin = (setUser: (user: string) => void) => {
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        } // Include credentials in the request
      );

      setUser(username); // Set user on success
      return response.data;
    },
  });
};
