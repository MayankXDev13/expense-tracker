import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

interface UpdateTransactionInput {
  id: string;
  payload: Record<string, string | number | boolean>;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, payload }: UpdateTransactionInput) => {
      if (!id) throw new Error("Transaction ID is required for update");

      const response = await axiosInstance.put(`/transaction/${id}`, payload);
      return response.data.data;
    },

    onSuccess: () => {
      toast.success("Transaction Updated", {
        description: "The transaction has been successfully updated!",
      });

      // Invalidate all variants of transactions queries (including with filters)
      queryClient.invalidateQueries({ queryKey: ["transactions"], exact: false });
    },

    onError: (error: AxiosError) => {
      toast.error("Failed to Update Transaction", {
        description:
          (error.response?.data as { message?: string })?.message ||
          "Something went wrong while updating the transaction.",
      });
    },
  });

  return mutation;
}
