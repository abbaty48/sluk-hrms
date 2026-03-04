import type {
  TLeaveTypeDistribution,
  TLeaveCalendarEntry,
  TLeaveEligibility,
  TLeaveApplication,
  TLeaveValidation,
  TLeaveApproval,
  TLeaveConflict,
  TLeaveTrend,
  TLeaveStatus,
  TLeaveRequest,
} from "@/types/leave-managementTypes";
import type { Application, Response } from "express";
import type { TAuthRequest, TDatabase } from "@/types/types";

export function hrmsLEAVE_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {
  // Leave type distribution (for pie chart)
  server.get(
    "/api/charts/leave-type-distribution",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year } = req.query;
      const targetYear = year
        ? parseInt(year as string)
        : new Date().getFullYear();

      // Filter leaves by year
      const yearLeaves = db.leaves.filter((leave) => {
        const leaveYear = new Date(leave.startDate).getFullYear();
        return leaveYear === targetYear && leave.status === "APPROVED";
      });

      // Count leaves by type
      const leaveTypeCounts = new Map<string, number>();
      yearLeaves.forEach((leave) => {
        const leaveType = db.leaveTypes.find(
          (lt) => lt.id === leave.leaveTypeId,
        );
        if (leaveType) {
          leaveTypeCounts.set(
            leaveType.name,
            (leaveTypeCounts.get(leaveType.name) || 0) + leave.totalDays,
          );
        }
      });

      // If no actual data, generate sample data for demonstration
      if (leaveTypeCounts.size === 0) {
        db.leaveTypes.forEach((lt) => {
          // Simulate realistic leave distribution
          const baseAmount = lt.allowedDays * 15; // Assume 15 people take leaves
          const variance = Math.random() * 0.3; // ±30% variance
          const amount = Math.floor(baseAmount * (1 + variance - 0.15));
          leaveTypeCounts.set(lt.name, amount);
        });
      }

      const total = Array.from(leaveTypeCounts.values()).reduce(
        (sum, val) => sum + val,
        0,
      );

      // Define colors for different leave types
      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
      ];

      const chartData: TLeaveTypeDistribution[] = Array.from(
        leaveTypeCounts.entries(),
      )
        .map(([name, value], index) => ({
          name,
          value,
          percentage: parseFloat(((value / total) * 100).toFixed(1)),
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.value - a.value);

      res.json(chartData);
    },
  );

  // Apply for leave
  server.post("/api/leaves", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      staffId,
      leaveTypeId,
      startDate,
      endDate,
      reason,
    }: TLeaveApplication = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leaveType = db.leaveTypes.find((lt) => lt.id === leaveTypeId);
    if (!leaveType) {
      res.status(400).json({ error: "Invalid leave type" });
      return;
    }

    const currentYear = new Date().getFullYear();
    const usedLeaves = db.leaves
      .filter(
        (l) =>
          l.staffId === staffId &&
          l.leaveTypeId === leaveTypeId &&
          l.status === "APPROVED" &&
          new Date(l.startDate).getFullYear() === currentYear,
      )
      .reduce((sum, l) => sum + l.totalDays, 0);

    if (usedLeaves + totalDays > leaveType.allowedDays) {
      res.status(400).json({
        error: "Insufficient leave balance",
        available: leaveType.allowedDays - usedLeaves,
        requested: totalDays,
      });
      return;
    }

    const newLeave = {
      id: `leave_${Date.now()}`,
      staffId,
      leaveTypeId,
      startDate,
      endDate,
      totalDays,
      reason,
      approverId: null,
      respondedAt: null,
      approverComments: null,
      status: "PENDING" as TLeaveStatus,
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.leaves.push(newLeave);
    saveDb(db);

    res.status(201).json(newLeave);
  });

  // Approve/Reject leave
  server.patch(
    "/api/leaves/:id/:status",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { comments }: TLeaveApproval = req.body;
      const leave = db.leaves.find((l) => l.id === req.params.id);

      if (!leave) {
        res.status(404).json({ error: "Leave not found" });
        return;
      }

      if (leave.status !== "PENDING") {
        res.status(400).json({ error: "Leave already processed" });
        return;
      }

      leave.status = req.params.status as TLeaveStatus;
      leave.approverComments = comments;
      leave.approverId = req.user?.staffId || null;
      leave.respondedAt = new Date().toISOString();
      leave.updatedAt = new Date().toISOString();
      saveDb(db);

      res.json(leave);
    },
  );

  // Get leaves with pagination
  server.get("/api/leaves", (req: TAuthRequest, res: Response): void => {
    const { leaves, leaveTypes, departments, staff: staffs } = getDb();
    const {
      search,
      type,
      status,
      fromDate,
      toDate,
      page = "1",
      limit = "5",
    } = req.query;

    let enrichedLeaves: TLeaveRequest[] = leaves;

    if (search) {
      const searchTerm = (search as string).toLowerCase();
      const _staffs = staffs.filter((staff) =>
        staff.name.toLowerCase().includes(searchTerm),
      );
      if (_staffs.length < 0) {
        res.status(404).send({ data: [] });
      }
      enrichedLeaves.filter((l) => _staffs.some((s) => s.id === l.staffId));
    }

    if (type) {
      enrichedLeaves = enrichedLeaves.filter((l) => l.leaveTypeId === type);
    }

    if (status) {
      enrichedLeaves = enrichedLeaves.filter(
        (l) => l.status.toLowerCase() === status.toString().toLocaleLowerCase(),
      );
    }

    if (fromDate && toDate) {
      enrichedLeaves = enrichedLeaves.filter(
        (l) =>
          l.startDate ===
            new Date(String(fromDate)).toLocaleDateString("en-CA") &&
          l.endDate === new Date(String(toDate)).toLocaleDateString("en-CA"),
      );
    }

    if (fromDate) {
      enrichedLeaves = enrichedLeaves.filter(
        (l) =>
          l.startDate ===
          new Date(String(fromDate)).toLocaleDateString("en-CA"),
      );
    }

    if (toDate) {
      enrichedLeaves = enrichedLeaves.filter(
        (l) =>
          l.endDate === new Date(String(toDate)).toLocaleDateString("en-CA"),
      );
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const total = enrichedLeaves.length;
    const paginatedLeaves = enrichedLeaves.slice(startIndex, endIndex);

    const enrichedLeavesResponse = paginatedLeaves.map((leave) => {
      const staff = staffs.find((s) => s.id === leave.staffId);
      const leaveType = leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
      const department = departments.find((d) => d.id === staff?.departmentId);

      return {
        id: leave.id,
        staff: {
          id: staff?.id ?? "NOT AVAILABLE",
          name: staff?.name ?? "NOT AVAILABLE",
          staffNo: staff?.staffNo ?? "NOT AVAILABLE",
          department: department?.name ?? "NOT AVAILABLE",
        },
        status: leave.status,
        reason: leave.reason,
        endDate: leave.endDate,
        startDate: leave.startDate,
        allowedDays: leave.totalDays,
        leaveType: leaveType?.name || "UNKNOWN",
        duration: `${leave.startDate} ${leave.endDate}`,
      };
    });

    const result = {
      data: enrichedLeavesResponse,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        hasPrevPage: pageNum > 1,
        hasNextPage: endIndex < total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
    res.json(result);
  });

  // Leave Pending
  server.get(
    "/api/leaves/pending",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId, page = "1", limit = "5" } = req.query;

      let pendingLeaves = db.leaves.filter((l) => l.status === "PENDING");

      if (departmentId) {
        const deptStaff = db.staff
          .filter((s) => s.departmentId === departmentId)
          .map((s) => s.id);
        pendingLeaves = pendingLeaves.filter((l) =>
          deptStaff.includes(l.staffId),
        );
      }

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const total = pendingLeaves.length;
      const paginatedLeaves = pendingLeaves.slice(startIndex, endIndex);

      const enrichedLeaves = paginatedLeaves.map((leave) => {
        const staff = db.staff.find((s) => s.id === leave.staffId);
        const leaveType = db.leaveTypes.find(
          (lt) => lt.id === leave.leaveTypeId,
        );
        const department = db.departments.find(
          (d) => d.id === staff?.departmentId,
        );

        return {
          id: leave.id,
          staff: {
            id: staff?.id ?? "NOT AVAILABLE",
            name: staff?.name ?? "NOT AVAILABLE",
            staffNo: staff?.staffNo ?? "NOT AVAILABLE",
            department: department?.name ?? "NOT AVAILABLE",
          },
          status: leave.status,
          reason: leave.reason,
          endDate: leave.endDate,
          startDate: leave.startDate,
          allowedDays: leave.totalDays,
          leaveType: leaveType?.name || "UNKNOWN",
          duration: `${leave.startDate} ${leave.endDate}`,
        };
      });

      const result = {
        data: enrichedLeaves,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: endIndex < total,
          hasPrevPage: pageNum > 1,
        },
      };
      res.json(result);
    },
  );

  // Team leave calendar
  server.get(
    "/api/departments/:id/leaves/calendar",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { month, year } = req.query;

      const deptStaff = db.staff.filter(
        (s) => s.departmentId === req.params.id,
      );
      const staffIds = deptStaff.map((s) => s.id);

      let leaves = db.leaves.filter(
        (l) =>
          staffIds.includes(l.staffId) &&
          (l.status === "APPROVED" || l.status === "PENDING"),
      );

      if (month && year) {
        leaves = leaves.filter((l) => {
          const leaveDate = new Date(l.startDate);
          return (
            leaveDate.getMonth() + 1 === parseInt(month as string) &&
            leaveDate.getFullYear() === parseInt(year as string)
          );
        });
      }

      const calendar: TLeaveCalendarEntry[] = [];
      leaves.forEach((leave) => {
        const staff = deptStaff.find((s) => s.id === leave.staffId);
        const leaveType = db.leaveTypes.find(
          (lt) => lt.id === leave.leaveTypeId,
        );

        calendar.push({
          date: leave.startDate,
          staffId: staff?.id || "",
          staffName: staff?.name || "",
          leaveType: leaveType?.name || "",
          totalDays: leave.totalDays,
          status: leave.status,
        });
      });

      res.json(calendar);
    },
  );

  // Check leave conflicts
  server.get(
    "/api/leaves/conflicts",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId, startDate, endDate } = req.query;

      if (!departmentId || !startDate || !endDate) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
      }

      const deptStaff = db.staff
        .filter((s) => s.departmentId === departmentId)
        .map((s) => s.id);
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const conflictingLeaves = db.leaves.filter((l) => {
        if (!deptStaff.includes(l.staffId)) return false;
        if (l.status !== "APPROVED" && l.status !== "PENDING") return false;

        const leaveStart = new Date(l.startDate);
        const leaveEnd = new Date(l.endDate);

        return leaveStart <= end && leaveEnd >= start;
      });

      const staffNames = conflictingLeaves.map((l) => {
        const staff = db.staff.find((s) => s.id === l.staffId);
        return staff?.name || "Unknown";
      });

      const details = conflictingLeaves.map((l) => {
        const staff = db.staff.find((s) => s.id === l.staffId);
        const leaveType = db.leaveTypes.find((lt) => lt.id === l.leaveTypeId);

        return {
          staffId: l.staffId,
          name: staff?.name || "",
          leaveType: leaveType?.name || "",
          dates: `${l.startDate} to ${l.endDate}`,
        };
      });

      const conflict: TLeaveConflict = {
        conflictCount: conflictingLeaves.length,
        staffOnLeave: staffNames,
        details,
      };

      res.json(conflict);
    },
  );

  // Leave eligibility check
  server.get(
    "/api/staff/:id/leave/eligibility",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { leaveTypeId } = req.query;

      const staff = db.staff.find((s) => s.id === req.params.id);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const leaveType = db.leaveTypes.find((lt) => lt.id === leaveTypeId);
      if (!leaveType) {
        res.status(400).json({ error: "Invalid leave type" });
        return;
      }

      const currentYear = new Date().getFullYear();
      const usedLeaves = db.leaves
        .filter(
          (l) =>
            l.staffId === req.params.id &&
            l.leaveTypeId === leaveTypeId &&
            l.status === "APPROVED" &&
            new Date(l.startDate).getFullYear() === currentYear,
        )
        .reduce((sum, l) => sum + l.totalDays, 0);

      const remainingDays = leaveType.allowedDays - usedLeaves;

      const eligibility: TLeaveEligibility = {
        eligible: remainingDays > 0,
        remainingDays,
        reason: remainingDays <= 0 ? "No leave balance remaining" : undefined,
        warnings:
          remainingDays < 5 && remainingDays > 0 ? ["Low leave balance"] : [],
      };

      res.json(eligibility);
    },
  );

  // Leave Types
  server.get("/api/leaves/types", (_req: TAuthRequest, res: Response) => {
    const leavesTypes = getDb().leaveTypes || [];
    res.json(leavesTypes);
  });

  // Leave Types POST
  server.post("/api/leaves/types", (req: TAuthRequest, res: Response) => {
    const db = getDb();
    const leavesTypes = db.leaveTypes;
    const {
      name,
      allowedDays,
      carryForward = false,
      maxCarryForward = 0,
    } = req.body;

    if (!name || name === "" || name?.trim() === "") {
      res.status(400).send("Leave type name is required.");
      return;
    }

    if (!allowedDays || allowedDays < 0) {
      res
        .status(400)
        .send(
          "Leave type allowed day is required and must be greater than zero.",
        );
      return;
    }

    if (leavesTypes.some((l) => l.name === name)) {
      res.status(400).send(`Leave with '${name}' already exist.`);
      return;
    }

    leavesTypes.push({
      id: "lt_" + Date.now(),
      name,
      allowedDays,
      carryForward,
      maxCarryForward,
      paidLeave: false,
    });

    saveDb(db);

    res.status(204).send("A new leave type has successfully been added.");
  });

  // Leave Types PATCH
  server.put("/api/leaves/types/:id", (req: TAuthRequest, res: Response) => {
    const db = getDb();
    let leavesTypes = db.leaveTypes;
    const { id } = req.params;
    const {
      name,
      allowedDays,
      carryForward = false,
      maxCarryForward = 0,
    } = req.body;

    if (!name || name === "" || name?.trim() === "") {
      res.status(400).send("Leave type name is required.");
      return;
    }

    if (!allowedDays || allowedDays < 0) {
      res
        .status(400)
        .send(
          "Leave type allowed day is required and must be greater than zero.",
        );
      return;
    }

    const targetLeave = leavesTypes.find((l) => l.id === id);

    if (!targetLeave) {
      res.status(404).send("Leave does not exist.");
      return;
    }

    if (leavesTypes.some((l) => l.name === name)) {
      res.status(400).send(`Leave with '${name}' already exist.`);
      return;
    }

    leavesTypes = leavesTypes.map((l) =>
      l.id === id
        ? {
            id,
            name,
            allowedDays,
            carryForward,
            maxCarryForward,
            paidLeave: false,
          }
        : l,
    );
    saveDb(db);

    res.status(204).send("A leave type is updated successfully.");
  });

  // LEAVE TYPES DELETE
  server.delete("/api/leaves/types/:id", (req: TAuthRequest, res: Response) => {
    const db = getDb();
    db.leaveTypes = db.leaveTypes.filter((leave) => leave.id !== req.params.id);
    saveDb(db);

    res.status(204).send("Deleted");
  });

  // LEAVE STATS
  server.get("/api/leaves/stats", (_, res: Response) => {
    let total = 0,
      approved = 0,
      rejected = 0,
      pending = 0;

    const stats = getDb().leaves.reduceRight((_, leave) => {
      if (leave.status === "APPROVED") ++approved;
      if (leave.status === "REJECTED") ++rejected;
      if (leave.status === "PENDING") ++pending;
      total++;

      return { total, approved, rejected, pending };
    }, {});

    res.json(stats);
  });

  // DELETE A LEAVE
  server.delete("/api/leaves", (req: TAuthRequest, res: Response) => {
    const db = getDb();
    db.leaveTypes = db.leaveTypes.filter((leave) => leave.id !== req.params.id);
    saveDb(db);

    res.status(204);
  });

  // Validate leave application
  server.post(
    "/api/leaves/validate",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { staffId, leaveTypeId, startDate, endDate } = req.body;

      const errors: string[] = [];
      const warnings: string[] = [];
      const conflicts: string[] = [];

      const staff = db.staff.find((s) => s.id === staffId);
      if (!staff) {
        errors.push("Staff not found");
      }

      const leaveType = db.leaveTypes.find((lt) => lt.id === leaveTypeId);
      if (!leaveType) {
        errors.push("Invalid leave type");
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        errors.push("End date must be after start date");
      }

      if (start < new Date()) {
        errors.push("Cannot apply for past dates");
      }

      if (leaveType && staff) {
        const totalDays =
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1;
        const currentYear = new Date().getFullYear();
        const usedLeaves = db.leaves
          .filter(
            (l) =>
              l.staffId === staffId &&
              l.leaveTypeId === leaveTypeId &&
              l.status === "APPROVED" &&
              new Date(l.startDate).getFullYear() === currentYear,
          )
          .reduce((sum, l) => sum + l.totalDays, 0);

        const remainingDays = leaveType.allowedDays - usedLeaves;

        if (totalDays > remainingDays) {
          errors.push(
            `Insufficient balance. Available: ${remainingDays} days, Requested: ${totalDays} days`,
          );
        }

        if (remainingDays < 5) {
          warnings.push("Low leave balance");
        }
      }

      if (staff) {
        const overlapping = db.leaves.filter((l) => {
          if (l.staffId !== staffId) return false;
          if (l.status === "REJECTED" || l.status === "CANCELLED") return false;

          const leaveStart = new Date(l.startDate);
          const leaveEnd = new Date(l.endDate);

          return leaveStart <= end && leaveEnd >= start;
        });

        if (overlapping.length > 0) {
          errors.push("You already have leave during this period");
        }
      }

      if (staff) {
        const deptStaff = db.staff
          .filter((s) => s.departmentId === staff.departmentId)
          .map((s) => s.id);
        const deptLeaves = db.leaves.filter((l) => {
          if (!deptStaff.includes(l.staffId) || l.staffId === staffId)
            return false;
          if (l.status !== "APPROVED" && l.status !== "PENDING") return false;

          const leaveStart = new Date(l.startDate);
          const leaveEnd = new Date(l.endDate);

          return leaveStart <= end && leaveEnd >= start;
        });

        if (deptLeaves.length > 2) {
          warnings.push(
            `${deptLeaves.length} team members are on leave during this period`,
          );
        }
      }

      const validation: TLeaveValidation = {
        valid: errors.length === 0,
        errors,
        warnings,
        conflicts,
      };
      saveDb(db);

      res.json(validation);
    },
  );

  // Leave trends chart
  server.get(
    "/api/charts/leave-trends",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { months } = req.query;
      const monthCount = months ? parseInt(months as string) : 12;

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentDate = new Date();
      const trends: TLeaveTrend[] = [];

      for (let i = monthCount - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthLeaves = db.leaves.filter((l) => {
          const leaveDate = new Date(l.appliedAt);
          return (
            leaveDate.getMonth() === month && leaveDate.getFullYear() === year
          );
        });

        trends.push({
          month: `${monthName} ${year}`,
          applications: monthLeaves.length,
          approvals: monthLeaves.filter((l) => l.status === "APPROVED").length,
          rejections: monthLeaves.filter((l) => l.status === "REJECTED").length,
          pending: monthLeaves.filter((l) => l.status === "PENDING").length,
        });
      }

      res.json(trends);
    },
  );
}
