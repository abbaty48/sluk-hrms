import type {
  TSystemPreferences,
  TUpdatePreferencesRequest,
} from "@/types/settingsTypes";
import type {
  TNatureOfAppointment,
  TAppointmentsListResponse,
  TCreateAppointmentRequest,
} from "@sluk/src/types/appointmentTypes";
import type {
  TCommittee,
  TCommitteesListResponse,
  TCreateCommitteeRequest,
} from "@sluk/src/types/committeeTypes";
import type {
  TRank,
  TCreateRankRequest,
  TRanksListResponse,
} from "@sluk/src/types/rankTypes";
import type {
  TResponsibility,
  TCreateResponsibilityRequest,
  TResponsibilitiesListResponse,
} from "@sluk/src/types/responsibilityTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSystemPreferences() {
  return useQuery({
    queryKey: ["settings", "preferences"],
    queryFn: async () => {
      const response = await fetch("/api/settings/preferences");
      if (!response.ok) throw new Error("Failed to fetch preferences");
      return response.json() as Promise<TSystemPreferences>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdatePreferencesRequest) => {
      const response = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
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
    queryFn: async () => {
      const response = await fetch(`/api/settings/committees${params}`);
      if (!response.ok) throw new Error("Failed to fetch committees");
      return response.json() as Promise<TCommitteesListResponse>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateCommitteeRequest) => {
      const response = await fetch("/api/settings/committees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create committee");
      return response.json();
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
      const response = await fetch(`/api/settings/committees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update committee");
      return response.json();
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
      const response = await fetch(`/api/settings/committees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete committee");
      return response.json();
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
    queryFn: async () => {
      const response = await fetch(`/api/settings/responsibilities?${params}`);
      if (!response.ok) throw new Error("Failed to fetch responsibilities");
      return response.json() as Promise<TResponsibilitiesListResponse>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateResponsibilityRequest) => {
      const response = await fetch("/api/settings/responsibilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create responsibility");
      return response.json();
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
      const response = await fetch(`/api/settings/responsibilities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update responsibility");
      return response.json();
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
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/settings/responsibilities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete responsibility");
      return response.json();
    },
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
    queryFn: async () => {
      const response = await fetch(`/api/settings/ranks?${params}`);
      if (!response.ok) throw new Error("Failed to fetch ranks");
      return response.json() as Promise<TRanksListResponse>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateRankRequest) => {
      const response = await fetch("/api/settings/ranks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create rank");
      return response.json();
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
      const response = await fetch(`/api/settings/ranks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update rank");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "ranks"] });
    },
  });
}

export function useDeleteRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/settings/ranks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete rank");
      return response.json();
    },
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
    queryFn: async () => {
      const response = await fetch(`/api/settings/appointments${params}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json() as Promise<TAppointmentsListResponse>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateAppointmentRequest) => {
      const response = await fetch("/api/settings/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create appointment");
      return response.json();
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
      const response = await fetch(`/api/settings/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update appointment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/settings/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete appointment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "appointments"] });
    },
  });
}
