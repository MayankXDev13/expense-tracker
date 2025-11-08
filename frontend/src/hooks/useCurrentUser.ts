import { useQuery } from "@tanstack/react-query";
import api from "../lib/axiosInstance";

const getCurrentUser = async () => {
  const response = await api.get("/user/getCurrentUser");
  return response.data;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });
}
