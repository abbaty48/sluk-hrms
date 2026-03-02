import type { TDepartment, TRank } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 *
 * @returns Department[]
 */
export const useAdminDepartment = () => {
  const { data } = useSuspenseQuery<TDepartment[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const resp = await fetch("/api/departments");
      if (!resp.ok) return [];

      return await resp.json()
    },
  });

  return { data };
};

/**
 *
 * @returns Rank[]
 */
export const useAdminRank = () => {
  const { data } = useSuspenseQuery<{ data: TRank[] }>({
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
