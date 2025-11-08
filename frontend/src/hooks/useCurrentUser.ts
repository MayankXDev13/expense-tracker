import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user/getCurrentUser");
  return response.data;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });
}
