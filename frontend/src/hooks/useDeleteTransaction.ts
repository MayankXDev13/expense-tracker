import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`transaction/${id}`);
      return response.data;
    },

    onSuccess: () => {
      toast("Transaction Deleted", {
        description: "The transaction has been removed successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      toast("Failed to Delete Transaction", {
        description:
          error.response?.data?.message ||
          "Something went wrong while deleting the transaction.",
      });
    },
  });
}