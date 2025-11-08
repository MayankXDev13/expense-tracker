import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";
import axiosInstance from "@/lib/axiosInstance";



export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedTx: Transaction) => {
      if (!updatedTx._id)
        throw new Error("Transaction ID is required for update");

      const response = await axiosInstance.put(
        `/transaction/${updatedTx._id}`,
        updatedTx
      );

      return response.data;
    },

    onSuccess: () => {
      toast("Transaction Updated", {
        description: "The transaction has been successfully updated!",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error: AxiosError) => {
      toast("Failed to Update Transaction", {
        description:
          (error.response?.data as { message?: string })?.message ||
          "Something went wrong while updating.",
      });
    },
  });

  return mutation;
}
