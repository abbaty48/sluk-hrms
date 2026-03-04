// ========================================
// ANALYTICS & REPORTS ENDPOINTS
// ========================================
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { Application, Response } from "express";

export function hrmsANALYTICS_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
) {
  // 1. Staff Strength Over Years
  server.get(
    "/api/analytics/staff-strength-years",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { startYear, endYear } = req.query;

      // Get year range (default: last 5 years)
      const currentYear = new Date().getFullYear();
      const start = startYear ? parseInt(startYear as string) : currentYear - 4;
      const end = endYear ? parseInt(endYear as string) : currentYear;

      const yearData = [];

      for (let year = start; year <= end; year++) {
        // Count staff by gender for this year
        const yearStaff = db.staff.filter((s) => {
          const joinYear = new Date(s.createdAt).getFullYear();
          return joinYear <= year && s.status === "Employed";
        });

        const male = yearStaff.filter((s) => s.gender === "Male").length;
        const female = yearStaff.filter((s) => s.gender === "Female").length;

        yearData.push({
          year: year.toString(),
          Male: male,
          Female: female,
          total: male + female,
        });
      }

      res.json(yearData);
    },
  );

  // 2. Staff by Category (Pie Chart Data)
  server.get(
    "/api/analytics/staff-by-category",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId } = req.query;

      let staff = db.staff.filter((s) => s.status === "Employed");

      // Filter by department if specified
      if (departmentId) {
        staff = staff.filter((s) => s.departmentId === departmentId);
      }

      // Group by cadre
      const categoryCount = {
        Teaching: 0,
        "Non-Teaching": 0,
        Admin: 0,
      };

      staff.forEach((s) => {
        if (s.cadre === "Teaching") {
          categoryCount.Teaching++;
        } else if (s.cadre === "Non-Teaching") {
          categoryCount["Non-Teaching"]++;
        } else {
          categoryCount.Admin++;
        }
      });

      // Convert to array format for pie chart
      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
      ];
      const data = [
        { name: "Academic", value: categoryCount.Teaching, color: colors[2] },
        {
          name: "Non-Academic",
          value: categoryCount["Non-Teaching"],
          color: colors[3],
        },
        { name: "Admin", value: categoryCount.Admin, color: colors[0] },
      ];

      res.json(data);
    },
  );

  // 3. Staff by Department (Horizontal Bar Chart)
  server.get(
    "/api/analytics/staff-by-department",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { limit = "10" } = req.query;

      const staff = db.staff.filter((s) => s.status === "Employed");

      // Count staff per department
      const deptCounts = new Map<string, number>();
      staff.forEach((s) => {
        const count = deptCounts.get(s.departmentId) || 0;
        deptCounts.set(s.departmentId, count + 1);
      });

      // Convert to array with department names
      const data = Array.from(deptCounts.entries())
        .map(([deptId, count]) => {
          const dept = db.departments.find((d) => d.id === deptId);
          return {
            department: dept?.name || "Unknown",
            staffCount: count,
          };
        })
        .sort((a, b) => b["staffCount"] - a["staffCount"])
        .slice(0, parseInt(limit as string));

      res.json(data);
    },
  );

  // 4. Monthly Leave Usage Trend
  server.get(
    "/api/analytics/monthly-leave-usage",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { months = "6" } = req.query;

      const monthsCount = parseInt(months as string);
      const now = new Date();
      const data = [];

      for (let i = monthsCount - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        // const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
        const monthName = date.toLocaleDateString("en-US", { month: "short" });

        // Count leave days for this month
        const monthLeaves = db.leaves.filter((leave) => {
          if (leave.status !== "APPROVED") return false;

          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          // Check if leave overlaps with this month
          return startDate <= monthEnd && endDate >= monthStart;
        });

        const totalDays = monthLeaves.reduce((sum, leave) => {
          const start = new Date(
            Math.max(
              new Date(leave.startDate).getTime(),
              new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
            ),
          );
          const end = new Date(
            Math.min(
              new Date(leave.endDate).getTime(),
              new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime(),
            ),
          );
          const days =
            Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1;
          return sum + days;
        }, 0);

        data.push({
          month: monthName,
          "Leave Days Used": totalDays,
        });
      }

      res.json(data);
    },
  );

  // 5. Payroll Breakdown (Monthly)
  server.get(
    "/api/analytics/payroll-breakdown",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { months = "6" } = req.query;

      const monthsCount = parseInt(months as string);
      const now = new Date();
      const data = [];

      // Get total active staff for calculations
      const activeStaff = db.staff.filter(
        (s) => s.status === "Employed",
      ).length;

      for (let i = monthsCount - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString("en-US", { month: "short" });

        // Calculate payroll components (in millions)
        // These are example calculations - adjust based on your actual payroll data
        const baseSalary = activeStaff * 250000; // Average 250k per staff
        const allowances = baseSalary * 0.15; // 15% of salary
        const deductions = baseSalary * 0.05; // 5% of salary

        data.push({
          month: monthName,
          Salary: parseFloat((baseSalary / 1000000).toFixed(2)), // Convert to millions
          Allowances: parseFloat((allowances / 1000000).toFixed(2)),
          Deductions: parseFloat((deductions / 1000000).toFixed(2)),
        });
      }

      res.json(data);
    },
  );

  // 6. Complete Analytics Summary
  server.get(
    "/api/analytics/summary",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId, year } = req.query;

      let staff = db.staff.filter((s) => s.status === "Employed");

      if (departmentId) {
        staff = staff.filter((s) => s.departmentId === departmentId);
      }

      const currentYear = year
        ? parseInt(year as string)
        : new Date().getFullYear();

      // Staff statistics
      const totalStaff = staff.length;
      const maleStaff = staff.filter((s) => s.gender === "Male").length;
      const femaleStaff = staff.filter((s) => s.gender === "Female").length;

      // Category breakdown
      const teaching = staff.filter((s) => s.cadre === "Teaching").length;
      const nonTeaching = staff.filter(
        (s) => s.cadre === "Non-Teaching",
      ).length;
      const admin = staff.filter(
        (s) => s.cadre !== "Teaching" && s.cadre !== "Non-Teaching",
      ).length;

      // Leave statistics for current year
      const yearLeaves = db.leaves.filter((leave) => {
        const leaveYear = new Date(leave.startDate).getFullYear();
        return leaveYear === currentYear;
      });

      const approvedLeaves = yearLeaves.filter(
        (l) => l.status === "APPROVED",
      ).length;
      const pendingLeaves = yearLeaves.filter(
        (l) => l.status === "PENDING",
      ).length;
      const rejectedLeaves = yearLeaves.filter(
        (l) => l.status === "REJECTED",
      ).length;

      // Calculate total leave days
      const totalLeaveDays = yearLeaves
        .filter((l) => l.status === "APPROVED")
        .reduce((sum, leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days =
            Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1;
          return sum + days;
        }, 0);

      // Payroll summary (annual)
      const annualSalary = totalStaff * 250000 * 12;
      const annualAllowances = annualSalary * 0.15;
      const annualDeductions = annualSalary * 0.05;
      const netPayroll = annualSalary + annualAllowances - annualDeductions;

      const summary = {
        staff: {
          total: totalStaff,
          male: maleStaff,
          female: femaleStaff,
          teaching,
          nonTeaching,
          admin,
        },
        leave: {
          total: yearLeaves.length,
          approved: approvedLeaves,
          pending: pendingLeaves,
          rejected: rejectedLeaves,
          totalDays: totalLeaveDays,
        },
        payroll: {
          annualSalary: parseFloat((annualSalary / 1000000).toFixed(2)), // In millions
          annualAllowances: parseFloat((annualAllowances / 1000000).toFixed(2)),
          annualDeductions: parseFloat((annualDeductions / 1000000).toFixed(2)),
          netPayroll: parseFloat((netPayroll / 1000000).toFixed(2)),
        },
        year: currentYear,
      };

      res.json(summary);
    },
  );

  // 7. Department Performance Report
  server.get(
    "/api/analytics/department-performance",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();

      const departments = db.departments.map((dept) => {
        const deptStaff = db.staff.filter(
          (s) => s.departmentId === dept.id && s.status === "Employed",
        );

        // Leave statistics
        const deptLeaves = db.leaves.filter((leave) => {
          const staff = db.staff.find((s) => s.id === leave.staffId);
          return staff && staff.departmentId === dept.id;
        });

        const approvedLeaves = deptLeaves.filter(
          (l) => l.status === "APPROVED",
        ).length;

        return {
          department: dept.name,
          staffCount: deptStaff.length,
          male: deptStaff.filter((s) => s.gender === "Male").length,
          female: deptStaff.filter((s) => s.gender === "Female").length,
          teaching: deptStaff.filter((s) => s.cadre === "Teaching").length,
          nonTeaching: deptStaff.filter((s) => s.cadre === "Non-Teaching")
            .length,
          totalLeaves: deptLeaves.length,
          approvedLeaves,
          leaveApprovalRate:
            deptLeaves.length > 0
              ? parseFloat(
                  ((approvedLeaves / deptLeaves.length) * 100).toFixed(1),
                )
              : 0,
        };
      });

      // Sort by staff count descending
      departments.sort((a, b) => b.staffCount - a.staffCount);

      res.json(departments);
    },
  );

  // 8. Year-over-Year Growth
  server.get(
    "/api/analytics/year-over-year-growth",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();

      const currentYear = new Date().getFullYear();
      const years = [currentYear - 2, currentYear - 1, currentYear];

      const growthData = years.map((year) => {
        const yearEnd = new Date(year, 11, 31);
        const staffAtYearEnd = db.staff.filter((s) => {
          const joinDate = new Date(s.createdAt);
          return joinDate <= yearEnd;
        }).length;

        return {
          year: year.toString(),
          totalStaff: staffAtYearEnd,
        };
      });

      // Calculate growth rates
      const dataWithGrowth = growthData.map((current, index) => {
        if (index === 0) {
          return { ...current, growthRate: 0 };
        }

        const previous = growthData[index - 1];
        const growthRate =
          previous.totalStaff > 0
            ? parseFloat(
                (
                  ((current.totalStaff - previous.totalStaff) /
                    previous.totalStaff) *
                  100
                ).toFixed(2),
              )
            : 0;

        return {
          ...current,
          growthRate,
          growth: current.totalStaff - previous.totalStaff,
        };
      });

      res.json(dataWithGrowth);
    },
  );

  // 9. Leave Type Distribution
  server.get(
    "/api/analytics/leave-type-distribution",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year } = req.query;

      const currentYear = year
        ? parseInt(year as string)
        : new Date().getFullYear();

      const yearLeaves = db.leaves.filter((leave) => {
        const leaveYear = new Date(leave.startDate).getFullYear();
        return leaveYear === currentYear && leave.status === "APPROVED";
      });

      // Group by leave type
      const typeCount = new Map<string, number>();
      yearLeaves.forEach((leave) => {
        const count = typeCount.get(leave.leaveTypeId) || 0;
        typeCount.set(leave.leaveTypeId, count + 1);
      });

      // Convert to array
      const data = Array.from(typeCount.entries()).map(([type, count]) => ({
        type,
        count,
        percentage: parseFloat(((count / yearLeaves.length) * 100).toFixed(1)),
      }));

      // Sort by count descending
      data.sort((a, b) => b.count - a.count);

      res.json(data);
    },
  );

  // 10. Export Report Data (for PDF/Excel)
  server.get(
    "/api/analytics/export",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId, startDate, endDate } = req.query;

      let staff = db.staff.filter((s) => s.status === "Employed");

      if (departmentId) {
        staff = staff.filter((s) => s.departmentId === departmentId);
      }

      // Enrich with department info
      const enrichedStaff = staff.map((s) => {
        const dept = db.departments.find((d) => d.id === s.departmentId);
        return {
          staffNo: s.staffNo,
          name: s.name,
          email: s.email,
          gender: s.gender,
          department: dept?.name || "N/A",
          rank: s.rank,
          cadre: s.cadre,
          category: s.staffCategory,
          status: s.status,
          joinDate: new Date(s.createdAt).toLocaleDateString(),
        };
      });

      res.json({
        generatedAt: new Date().toISOString(),
        totalRecords: enrichedStaff.length,
        filters: {
          departmentId,
          startDate,
          endDate,
        },
        data: enrichedStaff,
      });
    },
  );
}
