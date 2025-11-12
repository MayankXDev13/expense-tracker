import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import axiosInstance from "@/lib/axiosInstance";
import type { ITransaction } from "@/types/transaction.types";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTx: ITransaction) => {
      console.log(newTx);
      
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
