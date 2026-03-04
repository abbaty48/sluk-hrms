import type { TStaff } from "@/types/staffTypes";
import type { TDepartment } from "@/types/departmentTypes";
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

export function useStaffAPI(searchCriteria?: SearchStaffCriteria) {
  const {
    data,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery({
    initialPageParam: 1,
    maxPages: searchCriteria?.limit ? +searchCriteria.limit : 5,
    queryKey: ["admin", "staffs", { ...searchCriteria }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      // Add parameters properly
      params.set("page", pageParam.toString());
      params.set("limit", searchCriteria?.limit?.toString() || "5");

      if (searchCriteria?.q) {
        params.set("q", searchCriteria.q);
      }

      // Add other search criteria (avoid duplicating limit and q)
      if (searchCriteria) {
        Object.entries(searchCriteria).forEach(([key, value]) => {
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
    data: currentPage.data as (TStaff & {
      department: TDepartment;
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
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to add staff");
      }

      return response.json();
    },
  });
}
