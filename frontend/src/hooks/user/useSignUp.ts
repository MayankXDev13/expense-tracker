import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { ISignUpData, IAuthResponse } from "@/types/auth";
import type { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";
import axiosInstance from '@/lib/axiosInstance';

type ErrorResponse = {
  message?: string;
};

function isAxiosErrorWithResponse(
  error: unknown
): error is AxiosError<ErrorResponse> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export const useSignUp = (): UseMutationResult<
  IAuthResponse,
  AxiosError<ErrorResponse>,
  ISignUpData
> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<IAuthResponse, AxiosError<ErrorResponse>, ISignUpData>({
    mutationFn: async (data: ISignUpData) => {
      try {
        const response = await axiosInstance.post("/user/register", data);
        return response.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithResponse(error)) {
          const backendMessage =
            error.response?.data?.message ||
            "Sign-up failed. Please try again.";
          throw new Error(backendMessage);
        }
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Unexpected error occurred.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/signin" });
    },
  });
};
