import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";
import type { IBudget } from "@/types/budget.types";
import type { AxiosError } from "axios";

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IBudget>) => {
      const response = await api.post("/budget", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget created successfully");
    },
    onError: (error: AxiosError) => {
      toast.error((error.response?.data as { message?: string })?.message || "An unexpected error occurred.");
    },
  });
};
