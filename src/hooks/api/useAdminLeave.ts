import { queryClient, sleep } from "@/lib/utils";
import type { TPagination } from "@/types/types";
import { useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { LeaveType, LeaveStats, LeaveTypeDistribution, LeaveFilters, LeaveResponse } from "@/types/leave-management.types";


/**
 *
 */
async function invalidateQueries(queryKeys: string[]) {
    await Promise.all(queryKeys.map(q => queryClient.invalidateQueries({ queryKey: [q], refetchType: 'all' })));
}

type SearchCriteria = Partial<LeaveFilters>
export function useLeavesAPI(searchCriteria?: SearchCriteria) {

    const { data, refetch, isFetching, fetchNextPage, fetchPreviousPage } = useSuspenseInfiniteQuery({
        queryKey: ["leaves", { ...searchCriteria }],
        initialPageParam: 1,
        maxPages: searchCriteria?.limit ? +searchCriteria.limit : 5,
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            params.set("page", pageParam.toString());
            params.set("limit", searchCriteria?.limit?.toString() || "5");

            if (searchCriteria?.search) {
                params.set("search", searchCriteria.search);
            }

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

            return await ((await fetch(`/api/leaves?${params}`)).json());
        },
        getNextPageParam: (lastPage) => lastPage?.pagination.hasNextPage ?
            lastPage.pagination.page + 1 : undefined
        ,
        getPreviousPageParam: (firstPage) => firstPage?.pagination.hasPrevPage ?
            firstPage.pagination.page - 1 : undefined,
    })

    const currentPage = data.pages[data.pages.length - 1];

    return {
        refetch,
        isFetching,
        fetchNextPage,
        fetchPreviousPage,
        pagination: currentPage.pagination as TPagination,
        data: currentPage.data as (LeaveResponse[])
    }
}
/**
 *
 *
 */
export function useLeaveTypesAPI() {
    const { data } = useSuspenseQuery({
        queryKey: ["adminLeaveTypes"],
        queryFn: async () => {
            return await ((await fetch('/api/leaves/types')).json())
        }
    })
    return data as LeaveType[]
}

/**
 *
 *
 */
export function useLeaveStatsAPI() {

    const { data: stats } = useSuspenseQuery({
        queryKey: ["leaveStats"],
        queryFn: async (): Promise<LeaveStats> => {
            const response = await fetch("/api/leaves/stats");
            return await response.json() as LeaveStats;
        }
    });

    return stats

}
/**
 *
 *
 */

export function useLeaveTypesDeleteAPI() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            const response = await fetch(`/api/leave/types/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete leave type");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
        },
    });
}
/**
 *
 *
 */
export function useLeaveTypeDistributionAPI() {
    const { data } = useSuspenseQuery<LeaveTypeDistribution[]>({
        queryKey: ["leaveTypeDistribution"],
        queryFn: async () => {
            return fetch("/api/charts/leave-type-distribution?year=2025")
                .then((res) => res.json())
                .catch((error) => error.message);
        },
    });
    return { data };
}
/**
 *
 */
export function useLeavePending(departmentId?: string, limit = 10) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseInfiniteQuery({
            queryKey: ["leaves", "pending", departmentId],
            queryFn: async ({ pageParam = 1 }) => {
                const params = new URLSearchParams({
                    page: pageParam.toString(),
                    limit: limit.toString(),
                    ...(departmentId && { departmentId }),
                });
                try {
                    return await (await fetch(`/api/leaves/pending?${params}`)).json();
                } catch (error) {
                    return error;
                }
            },
            getNextPageParam: (lastPage) => {
                return lastPage?.pagination.hasNextPage
                    ? lastPage.pagination.page + 1
                    : undefined;
            },
            initialPageParam: 1,
        });

    return {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        data: data.pages.flatMap((page) => page.data),
    };
}
/**
 *
 */
export function useLeaveRejection() {
    return useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/leaves/${id}/REJECTED`, {
                method: "PATCH",
            });
        },
        onSuccess: async () => {
            await invalidateQueries(['leaveStats', 'leaves'])
        }
    });
}

/**
 *
 */
export function useLeaveApproval() {
    return useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/leaves/${id}/APPROVED`, {
                method: "PATCH",
                body: JSON.stringify({ comments: "Approved" }),
            });
        },
        onSuccess: async () => {
            await invalidateQueries(['leaveStats', 'leaves'])
        }
    });

}

/**
 *
 */
export function useLeaveCancelled() {
    return useMutation({
        mutationFn: async (id: string) => {
            await sleep(1000);
            await fetch(`/api/leaves/${id}/cancel`, { method: "POST" });
        },
    });
}

/**
 *
 */
export function useLeaveTypeUPSERTAPI() {

    type params = {
        id: string,
        payload: LeaveType
        action: 'CREATE' | 'UPDATE',
    }

    return useMutation({
        mutationFn: async ({ id, action, payload }: params) => {
            const { url, method } = {
                url: action === 'CREATE' ? '/api/leaves/types' : `/api/leaves/types/${id}`,
                method: action === 'CREATE' ? 'POST' : 'PUT',
            }
            const resp = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            return await resp.text()
        },
        onSuccess: async () => {
            await invalidateQueries(['adminLeaveTypes'])
        }
    });
}

/**
 *
*/

export function useLeaveTypeDeleteAPI() {

    return useMutation({
        mutationFn: async (id: string) => {
            const resp = await fetch(`/api/leaves/types/${id}`, {
                method: "DELETE",
            });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            return await resp.text()
        },
        onSuccess: async () => {
            await invalidateQueries(['adminLeaveTypes', 'leaves'])
        }
    });
}
