import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "../lib/axiosInstance";
import type { SignUpData, AuthResponse } from "@/types/auth";
import type { AxiosError } from "axios";
import { useRouter } from "@tanstack/react-router";

export const useSignUp = (): UseMutationResult<
  AuthResponse,
  AxiosError,
  SignUpData
> => {
  const router = useRouter();

  return useMutation<AuthResponse, AxiosError, SignUpData>({
    mutationFn: async (data: SignUpData) => {
      const response = await api.post("/user/register", data);
      return response.data;
    },
    onSuccess: () => {
      router.navigate({ to: "/signin"});
    },
    onError: (error) => {
      console.error("Sign-up failed:", error.response?.data || error.message);
    },
  });
};
