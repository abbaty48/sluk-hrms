import type { TStaffStats } from "@/types/staff-types";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeDashboard = (staffId: string) => {
  return useQuery({
    queryKey: ["employee-dashboard", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/staff/${staffId}/dashboard`);
      if (!res.ok) {
        throw new Error("Failed to fetch employee dashboard data.");
      }
      return res.json() as Promise<TStaffStats>;
    }
  });
};
