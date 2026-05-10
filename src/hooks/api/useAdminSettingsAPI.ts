import type {
  TSystemPreferences,
  TUpdatePreferencesRequest,
} from "@/types/settingsTypes";
import { apiFetch, invalidateQueries } from "@sluk/src/lib/api.utils";
import type {
  TAppointmentsList,
  TNatureOfAppointment,
  TCreateAppointmentRequest,
} from "@sluk/src/types/appointmentTypes";
import type {
  TCommittee,
  TCommitteesList,
  TCreateCommitteeRequest,
} from "@sluk/src/types/committeeTypes";
import type {
  TRank,
  TRanksList,
  TCreateRankRequest,
} from "@sluk/src/types/rankTypes";
import type {
  TResponsibility,
  TResponsibilitiesList,
  TCreateResponsibilityRequest,
} from "@sluk/src/types/responsibilityTypes";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

export function useSystemPreferences() {
  return useSuspenseQuery({
    queryKey: ["settings", "preferences"],
    queryFn: async () => {
      return await apiFetch<TSystemPreferences>("/api/settings/preferences");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdatePreferencesRequest) => {
      return await apiFetch("/api/settings/preferences", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "preferences"] });
    },
  });
}

// ========================================
// 3. COMMITTEES HOOKS
// ========================================

export function useCommittees({
  term,
  actives,
  page = 1,
  limit = "5",
}: Partial<{
  limit: string;
  page: number;
  term?: string;
  actives?: boolean;
}>) {
  //
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", limit);
  //
  if (term) {
    params.set("term", term);
  }
  if (actives) {
    params.set("actives", String(actives));
  }
  //
  const { data, fetchNextPage, fetchPreviousPage, isFetching } =
    useSuspenseInfiniteQuery({
      queryKey: ["settings", "committees", { page, limit, term, actives }],
      initialPageParam: 1,
      maxPages: +limit,
      queryFn: async () =>
        await apiFetch<TCommitteesList>(`/api/settings/committees?${params}`),
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.page ? lastPage.pagination.page + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage?.pagination?.page ? firstPage.pagination.page - 1 : undefined,
    });

  const currentPage = data.pages[data.pages.length - 1];

  return {
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}

export function useCreateCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateCommitteeRequest) => {
      return await apiFetch("/api/settings/committees", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "committees"] });
    },
  });
}

export function useUpdateCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TCommittee>;
    }) => {
      return await apiFetch(`/api/settings/committees/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "committees"] });
    },
  });
}

export function useDeleteCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(`/api/settings/committees/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "committees"] });
    },
  });
}

export function useCommitteeApi() {
  return {
    useCommittees,
    useCreateCommittee,
    useUpdateCommittee,
    useDeleteCommittee,
  };
}

// ========================================
// 4. RESPONSIBILITIES HOOKS
// ========================================

export function useResponsibilities(
  term: string | undefined = undefined,
  page: number = 1,
) {
  //
  const params = new URLSearchParams();
  params.set("page", String(page));
  //
  if (term) params.set("term", term);
  //
  const { data, isFetching } = useSuspenseInfiniteQuery({
    queryKey: ["settings", "responsibilities", term, page],
    queryFn: async () =>
      await apiFetch<TResponsibilitiesList>(
        `/api/settings/responsibilities?${params}`,
      ),
    maxPages: 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage?.pagination?.hasNextPage
        ? firstPage.pagination.page - 1
        : undefined,
  });

  const currentPage = data.pages[data.pages.length - 1];
  return {
    isFetching,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}

export function useCreateResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateResponsibilityRequest) => {
      return await apiFetch("/api/settings/responsibilities", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "responsibilities"],
      });
    },
  });
}

export function useUpdateResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TResponsibility>;
    }) => {
      return await apiFetch(`/api/settings/responsibilities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "responsibilities"],
      });
    },
  });
}

export function useDeleteResponsibility() {
  return useMutation({
    mutationFn: async (id: string) =>
      await apiFetch(`/api/settings/responsibilities/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      invalidateQueries(["settings", "responsibilities"]);
    },
  });
}

export const useResponsibilityAPI = {
  useResponsibilities,
  useCreateResponsibility,
  useUpdateResponsibility,
  useDeleteResponsibility,
};

// ========================================
// 5. RANKS HOOKS
// ========================================

export function useRanks(
  term: string | undefined = undefined,
  page: number = 1,
) {
  //
  const params = new URLSearchParams();
  params.set("page", String(page));
  //
  if (term) params.set("q", term);
  //
  const { data, isFetching } = useSuspenseInfiniteQuery({
    queryKey: ["settings", "ranks", term, page],
    queryFn: async () => await apiFetch<TRanksList>(`/api/ranks?${params}`),
    maxPages: 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage?.pagination?.hasNextPage
        ? firstPage.pagination.page - 1
        : undefined,
  });

  const currentPage = data.pages[data.pages.length - 1];
  return {
    isFetching,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}

export function useCreateRank() {
  return useMutation({
    mutationFn: async (data: TCreateRankRequest) => {
      return await apiFetch("/api/ranks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      invalidateQueries(["settings", "ranks"]);
    },
  });
}

export function useUpdateRank() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TRank> }) => {
      return await apiFetch(`/api/ranks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      invalidateQueries(["settings", "ranks"]);
    },
  });
}

export function useDeleteRank() {
  return useMutation({
    mutationFn: async (id: string) =>
      await apiFetch(`/api/ranks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      invalidateQueries(["settings", "ranks"]);
    },
  });
}

export const useRankAPI = {
  useRanks,
  useCreateRank,
  useUpdateRank,
  useDeleteRank,
};

// ========================================
// 6. NATURE OF APPOINTMENTS HOOKS
// ========================================

export function useAppointments(
  term: string | undefined = undefined,
  page: number = 1,
) {
  const params = new URLSearchParams();
  /** */
  params.set("page", String(page));
  /** */
  if (term) params.set("q", term);
  /** */
  // if (active) params.set("active", String(active));
  /** */
  const { data, isFetching } = useSuspenseInfiniteQuery({
    queryKey: ["settings", "appointments", term, page],
    queryFn: async () =>
      await apiFetch<TAppointmentsList>(`/api/settings/appointments?${params}`),
    maxPages: 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage?.pagination?.hasNextPage
        ? firstPage.pagination.page - 1
        : undefined,
  });

  const currentPage = data.pages[data.pages.length - 1];
  return {
    isFetching,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (data: TCreateAppointmentRequest) => {
      return await apiFetch("/api/settings/appointments", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });
    },
    onSuccess: () => {
      invalidateQueries(["settings", "appointments"]);
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TNatureOfAppointment>;
    }) => {
      return await apiFetch(`/api/settings/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await fetch(`/api/settings/appointments/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "appointments"] });
    },
  });
}

export const useAppointmentAPI = {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
};
