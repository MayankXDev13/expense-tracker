import api from "@/lib/axiosInstance";
import type { ICategory } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.data;
    },
  });
};
