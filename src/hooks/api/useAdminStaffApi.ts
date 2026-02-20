import type { Department, Staff } from "@sluk/src/types/types";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";

type SearchStaffCriteria = Partial<{
  q: string;
  page: string;
  sort: string;
  cadre: string;
  limit: string;
  status: string;
  departmentId: string;
}>;

export function useStaffAPI(searchCriterias?: SearchStaffCriteria) {
  const {
    data,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery({
    maxPages: 5,
    initialPageParam: 1,
    queryKey: ["admin", "staffs", { ...searchCriterias }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      // Add parameters properly
      params.set("page", pageParam.toString());
      params.set("limit", searchCriterias?.limit?.toString() || "5");

      if (searchCriterias?.q) {
        params.set("q", searchCriterias.q);
      }

      // Add other search criteria (avoid duplicating limit and q)
      if (searchCriterias) {
        Object.entries(searchCriterias).forEach(([key, value]) => {
          if (
            key !== "limit" &&
            key !== "q" &&
            value !== null &&
            value !== "null" &&
            value !== undefined
          ) {
            params.set(key, value.toString());
          }
        });
      }

      return await (await fetch(`/api/staff/search?${params}`)).json();
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage?.pagination.hasPrevPage
        ? firstPage.pagination.page - 1
        : undefined;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });

  // Get the most recent page data (last fetched page)
  const currentPage = data.pages[data.pages.length - 1];

  return {
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    allPages: data.pages,
    pagination: currentPage.pagination,
    data: currentPage.data as (Staff & {
      department: Department;
    })[],
  };
}

/**
 *
 */
export function useAddStaffAPI() {
  return useMutation({
    mutationFn: async (data: any) => {
      // Replace with your actual API endpoint
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add staff");
      }

      return response.json();
    },
  });
}
