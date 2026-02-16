import type { Department } from "@sluk/src/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useAdminDepartment = () => {
  const { data } = useSuspenseQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return fetch("/api/departments")
        .then((res) => res.json())
        .catch((error) => {
          throw error;
        });
    },
  });

  return { data };
};
