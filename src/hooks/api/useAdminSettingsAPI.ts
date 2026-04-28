import type {
  TSystemPreferences,
  TUpdatePreferencesRequest,
} from "@/types/settingsTypes";
import { apiFetch } from "@sluk/src/lib/api.utils";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSystemPreferences() {
  return useQuery({
    queryKey: ["settings", "preferences"],
    queryFn: async () =>
      await apiFetch<TSystemPreferences>("/api/settings/preferences"),
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

export function useCommittees(activeOnly = false) {
  const params = activeOnly ? "?active=true" : "";

  return useQuery({
    queryKey: ["settings", "committees", activeOnly],
    queryFn: async () =>
      await apiFetch<TCommitteesList>(`/api/settings/committees${params}`),
    staleTime: 2 * 60 * 1000,
  });
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
        method: "PATCH",
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

// ========================================
// 4. RESPONSIBILITIES HOOKS
// ========================================

export function useResponsibilities(filters?: {
  activeOnly?: boolean;
  department?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.activeOnly) params.set("active", "true");
  if (filters?.department) params.set("department", filters.department);

  return useQuery({
    queryKey: ["settings", "responsibilities", filters],
    queryFn: async () =>
      await apiFetch<TResponsibilitiesList>(
        `/api/settings/responsibilities?${params}`,
      ),
    staleTime: 2 * 60 * 1000,
  });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await apiFetch(`/api/settings/responsibilities/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "responsibilities"],
      });
    },
  });
}

// ========================================
// 5. RANKS HOOKS
// ========================================

export function useRanks(filters?: {
  activeOnly?: boolean;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.activeOnly) params.set("active", "true");
  if (filters?.category) params.set("category", filters.category);

  return useQuery({
    queryKey: ["settings", "ranks", filters],
    queryFn: async () =>
      await apiFetch<TRanksList>(`/api/settings/ranks?${params}`),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateRankRequest) => {
      return await apiFetch("/api/settings/ranks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "ranks"] });
    },
  });
}

export function useUpdateRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TRank> }) => {
      return await apiFetch(`/api/settings/ranks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "ranks"] });
    },
  });
}

export function useDeleteRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await fetch(`/api/settings/ranks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "ranks"] });
    },
  });
}

// ========================================
// 6. NATURE OF APPOINTMENTS HOOKS
// ========================================

export function useAppointments(activeOnly = false) {
  const params = activeOnly ? "?active=true" : "";

  return useQuery({
    queryKey: ["settings", "appointments", activeOnly],
    queryFn: async () =>
      await apiFetch<TAppointmentsList>(`/api/settings/appointments${params}`),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateAppointmentRequest) => {
      return await apiFetch("/api/settings/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "appointments"] });
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
