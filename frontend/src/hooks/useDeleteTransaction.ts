import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api/v1/expenseTracker/transaction";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`${BASE_URL}/delete/${id}`, {
        withCredentials: true,
      });
      return data;
    },

    onSuccess: () => {
      toast("Transaction Deleted", {
        description: "The transaction has been removed successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error: any) => {
      toast("Failed to Delete Transaction", {
        description:
          error.response?.data?.message ||
          "Something went wrong while deleting the transaction.",
      });
    },
  });
}
