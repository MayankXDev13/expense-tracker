import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "../lib/axiosInstance";
import type { SignInData, AuthResponse } from "@/types/auth";
import type { AxiosError } from "axios";
import { useRouter } from "@tanstack/react-router";

export const useSignIn = (): UseMutationResult<
  AuthResponse,
  AxiosError,
  SignInData
> => {
  const router = useRouter();
  return useMutation<AuthResponse, AxiosError, SignInData>({
    mutationFn: async (data: SignInData) => {
      const response = await api.post("/user/login", data);
      return response.data;
    },
    onSuccess: () => {
      router.navigate({ to: "/" });
      console.log("User signed in successfully");
    },
    onError: (error) => {
      console.error("Sign-in failed:", error.response?.data || error.message);
    },
  });
};
