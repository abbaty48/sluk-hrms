import type {
  MonthlyLeaveData,
  AnalyticsSummary,
  ExportReportData,
  AnalyticsFilters,
  StaffCategoryData,
  YearOverYearGrowth,
  StaffDepartmentData,
  DepartmentPerformance,
  StaffStrengthYearData,
  LeaveTypeDistribution,
} from "@/types/analytic-types";
import { apiFetch } from "@sluk/src/lib/api.utils";
import type { PayrollBreakdownData } from "@sluk/src/types/analyticTypes";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

// 1. Staff Strength Over Years
export function useStaffStrengthYears(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.startYear) params.set("startYear", filters.startYear.toString());
  if (filters?.endYear) params.set("endYear", filters.endYear.toString());

  return useSuspenseQuery({
    queryKey: ["analytics", "staff-strength-years", filters],
    queryFn: async () =>
      await apiFetch<StaffStrengthYearData[]>(
        `/api/analytics/staff-strength-years?${params}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 2. Staff by Category
export function useStaffByCategory(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.departmentId) params.set("departmentId", filters.departmentId);

  return useSuspenseQuery({
    queryKey: ["analytics", "staff-by-category", filters],
    queryFn: async () => {
      return await apiFetch<StaffCategoryData[]>(
        `/api/analytics/staff-by-category?${params}`,
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 3. Staff by Department
export function useStaffByDepartment(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.limit) params.set("limit", filters.limit.toString());

  return useSuspenseQuery({
    queryKey: ["analytics", "staff-by-department", filters],
    queryFn: async () =>
      await apiFetch<StaffDepartmentData[]>(
        `/api/analytics/staff-by-department?${params}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 4. Monthly Leave Usage
export function useMonthlyLeaveUsage(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.months) params.set("months", filters.months.toString());

  return useSuspenseQuery({
    queryKey: ["analytics", "monthly-leave-usage", filters],
    queryFn: async () =>
      await apiFetch<MonthlyLeaveData[]>(
        `/api/analytics/monthly-leave-usage?${params}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 5. Payroll Breakdown
export function usePayrollBreakdown(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.months) params.set("months", filters.months.toString());

  return useSuspenseQuery({
    queryKey: ["analytics", "payroll-breakdown", filters],
    queryFn: async () =>
      await apiFetch<PayrollBreakdownData>(
        `/api/analytics/payroll-breakdown?${params}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 6. Analytics Summary
export function useAnalyticsSummary(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.departmentId) params.set("departmentId", filters.departmentId);
  if (filters?.year) params.set("year", filters.year.toString());

  return useQuery({
    queryKey: ["analytics", "summary", filters],
    queryFn: async () =>
      await apiFetch<AnalyticsSummary>(`/api/analytics/summary?${params}`),
    staleTime: 5 * 60 * 1000,
  });
}

// 7. Department Performance
export function useDepartmentPerformance() {
  return useQuery({
    queryKey: ["analytics", "department-performance"],
    queryFn: async () =>
      await apiFetch<DepartmentPerformance[]>(
        `/api/analytics/department-performance`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 8. Year-over-Year Growth
export function useYearOverYearGrowth() {
  return useQuery({
    queryKey: ["analytics", "year-over-year-growth"],
    queryFn: async () =>
      await apiFetch<YearOverYearGrowth[]>(
        `/api/analytics/year-over-year-growth`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 9. Leave Type Distribution
export function useLeaveTypeDistribution(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.year) params.set("year", filters.year.toString());

  return useQuery({
    queryKey: ["analytics", "leave-type-distribution", filters],
    queryFn: async () =>
      await apiFetch<LeaveTypeDistribution[]>(
        `/api/analytics/leave-type-distribution?${params}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// 10. Export Report Data
export function useExportReportData(filters?: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters?.departmentId) params.set("departmentId", filters.departmentId);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);

  return useQuery({
    queryKey: ["analytics", "export", filters],
    queryFn: async () =>
      await apiFetch<ExportReportData>(`/api/analytics/export?${params}`),
    enabled: false, // Only fetch when explicitly called
  });
}

// Combined hook for all analytics data
export function useAllAnalytics(filters?: AnalyticsFilters) {
  const staffStrength = useStaffStrengthYears(filters);
  const staffCategory = useStaffByCategory(filters);
  const staffDepartment = useStaffByDepartment(filters);
  const leaveUsage = useMonthlyLeaveUsage(filters);
  const payroll = usePayrollBreakdown(filters);

  return {
    staffStrength,
    staffCategory,
    staffDepartment,
    leaveUsage,
    payroll,
    isLoading:
      staffStrength.isLoading ||
      staffCategory.isLoading ||
      staffDepartment.isLoading ||
      leaveUsage.isLoading ||
      payroll.isLoading,
    isError:
      staffStrength.isError ||
      staffCategory.isError ||
      staffDepartment.isError ||
      leaveUsage.isError ||
      payroll.isError,
  };
}
