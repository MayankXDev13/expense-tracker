import api from "@/lib/axiosInstance";
import type { ICategory } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryById = (id: string) => {
  return useQuery<ICategory[]>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};