import type { Department, Rank } from "@sluk/src/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 *
 * @returns Department[]
 */
export const useAdminDepartment = () => {
  const { data } = useSuspenseQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      return fetch("/api/departments")
        .then((res) => res.json())
        .catch((error) => {
          throw error;
        });
    },
  });

  return { data };
};

/**
 *
 * @returns Rank[]
 */
export const useAdminRank = () => {
  const { data } = useSuspenseQuery<{ data: Rank[] }>({
    queryKey: ["ranks"],
    queryFn: async () => {
      return fetch("/api/ranks")
        .then((res) => res.json())
        .catch((error) => {
          throw error;
        });
    },
  });

  return { ranks: data.data };
};
