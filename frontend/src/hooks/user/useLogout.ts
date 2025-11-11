import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("user/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/signin" });
    },
    onError: (error: AxiosError) => {
      console.error("Logout failed:", error.response?.data || error.message);
    },
  });

  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isSuccess: logoutMutation.isSuccess,
    isError: logoutMutation.isError,
  };
};
