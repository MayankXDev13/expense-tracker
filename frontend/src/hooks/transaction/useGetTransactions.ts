import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import type { ITransaction } from "@/types/transaction.types";

export function useGetTransactions(filters: {
  type?: string;
  category?: string;
  isActive?: string;
}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async (): Promise<ITransaction[]> => {
      const params = new URLSearchParams();

      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.isActive) params.append("isActive", filters.isActive);

      const response = await axiosInstance.get(
        `/transaction?${params.toString()}`
      );
      return response.data.data;
    },
  });
}
