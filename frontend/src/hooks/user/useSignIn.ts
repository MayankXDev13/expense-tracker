import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import type { ISignInData, IAuthResponse } from "@/types/auth";
import type { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

type ErrorResponse = {
  message?: string;
};

function isAxiosErrorWithMessage(
  error: unknown
): error is AxiosError<ErrorResponse> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export const useSignIn = (): UseMutationResult<
  IAuthResponse,
  AxiosError<ErrorResponse>,
  ISignInData
> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<IAuthResponse, AxiosError<ErrorResponse>, ISignInData>({
    mutationFn: async (data: ISignInData) => {
      try {
        const response = await api.post("/user/login", data);
        return response.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithMessage(error)) {
          const backendMessage =
            error.response?.data?.message ||
            "Sign-in failed. Please try again.";
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
      navigate({ to: "/" });
    },
  });
};
