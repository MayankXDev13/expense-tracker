import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";

import type { IBudget } from "@/types/budget.types";

export const useGetBudgets = () => {
  return useQuery<IBudget>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await api.get("/budgets");
      console.log("Get All Budget", response.data.data);
      return response.data.data;

    },
  });
};
