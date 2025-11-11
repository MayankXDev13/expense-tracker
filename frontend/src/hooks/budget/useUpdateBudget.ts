import api from "@/lib/axiosInstance";
import type { IBudget } from "@/types/budget.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<IBudget>;
    }) => {
      const response = await api.put(`/budgets/${id}`, payload);
      console.log("Update Budget", response.data.data);
      return response.data.data;
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget updated successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message?: string })?.message ||
          "An unexpected error occurred."
      );
    },
  });
};
