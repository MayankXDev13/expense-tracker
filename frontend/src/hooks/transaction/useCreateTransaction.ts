import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";
import axiosInstance from "@/lib/axiosInstance";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTx: Transaction) => {
      const response = await axiosInstance.post("/transaction", newTx);
      return response.data;
    },
    onSuccess: () => {
      toast("Transaction Created", {
        description: "Your new transaction has been added successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError) => {
      toast("Failed to Add Transaction", {
        description:
          (error.response?.data as { message?: string })?.message ||
          "Something went wrong while saving.",
      });
    },
  });

  return mutation;
}
