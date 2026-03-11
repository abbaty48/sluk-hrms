import type {
  TStaff,
  TStaffDetails,
  TEnrichedStaff,
  TStaffStatistics,
  TStaffPerDepartment,
  TStaffUpdateStatusRequest,
  TStaffUpdateStatusResponse,
} from "@/types/staffTypes";
import type { Application, Response } from "express";
import type { TAuthRequest, TDatabase } from "@/types/types";

export function hrmsSTAFF_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {
  server.get(
    "/api/staff/:id/employment",
    (req: TAuthRequest, res: Response) => {
      const db = getDb();
      const staffId = req.params.id;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;

      const all = (db.employmentHistory || []).filter(
        (h) => h.staffId === staffId,
      );

      const start = (page - 1) * limit;
      const paginated = all.slice(start, start + limit);

      res.json({
        data: paginated,
        nextPage: start + limit < all.length ? page + 1 : null,
      });
    },
  );

  // trying to get leave balance for a staff member
  server.get(
    "/api/staff/:id/leave-balances",
    (req: TAuthRequest, res: Response) => {
      const db = getDb();
      const staffId = req.params.id;

      const leaves = db.leaves.filter((l) => l.staffId === staffId);
      const types = db.leaveTypes;

      const balances = types.map((type) => {
        const used = leaves
          .filter((l) => l.leaveTypeId === type.id && l.status === "APPROVED")
          .reduce((sum, l) => sum + l.totalDays, 0);

        return {
          leaveTypeId: type.id,
          name: type.name,
          allowed: type.allowedDays,
          used,
          remaining: type.allowedDays - used,
        };
      });

      res.json(balances);
    },
  );

  // leaves history for a staff paginated
  server.get("/api/staff/:id/leaves", (req: TAuthRequest, res: Response) => {
    const db = getDb();

    const { id: staffId, page = 1, limit = 3 } = req.params;

    const staffLeaves = db.leaves
      .filter((l) => l.staffId === staffId)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = staffLeaves.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = staffLeaves.slice(startIndex, endIndex);

    const response = {
      data: paginatedData,
      pagination: {
        total,
        totalPages,
        page: pageNum,
        limit: limitNum,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
      },
    };
    res.json(response);
  });

  // Attendance summary for a staff member
  server.get("/api/staff/:id/attendance/summary", (req, res) => {
    const db = getDb();
    const { month, year, page = "1", limit = "5" } = req.query;

    let attendanceRecords = db.attendance.filter(
      (a) => a.staffId === req.params.id,
    );

    if (month && year) {
      attendanceRecords = attendanceRecords.filter((a) => {
        const date = new Date(a.date);
        return (
          date.getMonth() + 1 === parseInt(month as string) &&
          date.getFullYear() === parseInt(year as string)
        );
      });
    }

    // ---------- SUMMARY ----------
    const summary = {
      totalDays: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === "PRESENT").length,
      absent: attendanceRecords.filter((a) => a.status === "ABSENT").length,
      late: attendanceRecords.filter((a) => a.status === "LATE").length,
      onLeave: attendanceRecords.filter((a) => a.status === "ON_LEAVE").length,
      avgWorkHours:
        attendanceRecords.length > 0
          ? (
            attendanceRecords.reduce(
              (sum, a) => sum + (a.workHours || 0),
              0,
            ) / attendanceRecords.length
          ).toFixed(2)
          : "0",
    };

    // ---------- PAGINATION ----------
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const start = (pageNum - 1) * limitNum;
    const paginated = attendanceRecords.slice(start, start + limitNum);

    res.json({
      summary,
      logs: paginated,
      nextPage:
        start + limitNum < attendanceRecords.length ? pageNum + 1 : null,
    });
  });

  // Staff statistics
  server.get(
    "/api/staff/statistics",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();

      // By Department
      const deptCounts = new Map<string, number>();
      db.staff.forEach((s) => {
        const dept = db.departments.find((d) => d.id === s.departmentId);
        if (dept) {
          deptCounts.set(dept.name, (deptCounts.get(dept.name) || 0) + 1);
        }
      });

      // By Rank
      const rankCounts = new Map<string, number>();
      db.staff.forEach((s) => {
        rankCounts.set(s.rank, (rankCounts.get(s.rank) || 0) + 1);
      });

      // By Cadre
      const cadreCounts = new Map<string, number>();
      db.staff.forEach((s) => {
        cadreCounts.set(s.cadre, (cadreCounts.get(s.cadre) || 0) + 1);
      });

      // By State
      const stateCounts = new Map<string, number>();
      db.staff.forEach((s) => {
        if (s.state) {
          stateCounts.set(s.state, (stateCounts.get(s.state) || 0) + 1);
        }
      });

      // By Status
      const statusCounts = new Map<string, number>();
      db.staff.forEach((s) => {
        statusCounts.set(s.status, (statusCounts.get(s.status) || 0) + 1);
      });

      const stats: TStaffStatistics = {
        byDepartment: Array.from(deptCounts.entries())
          .map(([departmentName, count]) => ({ departmentName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20),
        byRank: Array.from(rankCounts.entries())
          .map(([rank, count]) => ({ rank, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20),
        byCadre: Array.from(cadreCounts.entries()).map(([cadre, count]) => ({
          cadre,
          count,
        })),
        byState: Array.from(stateCounts.entries())
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count),
        byStatus: Array.from(statusCounts.entries()).map(([status, count]) => ({
          status,
          count,
        })),
      };

      res.json(stats);
    },
  );

  // Search staff with pagination
  server.get("/api/staff/search", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      q,
      sort,
      cadre,
      state,
      status,
      page = "1",
      limit = "20",
      departmentId,
    } = req.query;

    let staff = db.staff;

    if (q) {
      const searchTerm = (q as string).toLowerCase();
      staff = staff.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.email.toLowerCase().includes(searchTerm) ||
          s.staffNo.toLowerCase().includes(searchTerm) ||
          s.rank.toLowerCase().includes(searchTerm),
      );
    }

    if (departmentId) {
      staff = staff.filter((s) => s.departmentId === departmentId);
    }

    if (cadre) {
      staff = staff.filter((s) => s.cadre === cadre);
    }

    if (status) {
      staff = staff.filter((s) => s.status === status);
    }

    if (state) {
      staff = staff.filter((s) => s.state === state);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const total = staff.length;
    const paginatedStaff = staff.slice(startIndex, endIndex);

    const departments = db.departments;
    const ranks = db.ranks;

    const enrichedStaff: TEnrichedStaff[] = paginatedStaff
      .map((s) => ({
        ...s,
        department: departments.find((d) => d.id === s.departmentId),
        rankDetails: ranks.find((r) => r.id === s.rankId),
      }))
      .sort((a, b) => {
        if (sort === "name_asc") {
          return a.name.localeCompare(b.name);
        } else if (sort === "name_desc") {
          return b.name.localeCompare(a.name);
        } else if (sort === "created_asc") {
          return a.createdAt.localeCompare(b.createdAt || "");
        } else if (sort === "created_desc") {
          return b.createdAt.localeCompare(a.createdAt || "");
        } else if (sort === "department") {
          return (
            b.department?.name.localeCompare(a.department?.name || "") || 0
          );
        } else {
          return 0;
        }
      });

    res.json({
      data: enrichedStaff,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: endIndex < total,
        hasPrevPage: pageNum > 1,
      },
    });
  });

  // Staff per department (for bar chart)
  server.get(
    "/api/charts/staff-per-department",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { limit } = req.query;
      const maxDept = limit ? parseInt(limit as string) : 10;

      const departmentCounts = new Map<
        string,
        { teaching: number; nonTeaching: number }
      >();

      // Count staff per department
      db.staff.forEach((staff) => {
        const dept = db.departments.find((d) => d.id === staff.departmentId);
        if (dept) {
          const current = departmentCounts.get(dept.name) || {
            teaching: 0,
            nonTeaching: 0,
          };
          if (staff.cadre === "Teaching") {
            current.teaching++;
          } else {
            current.nonTeaching++;
          }
          departmentCounts.set(dept.name, current);
        }
      });

      // Convert to array and sort by total staff count
      const chartData: TStaffPerDepartment[] = Array.from(
        departmentCounts.entries(),
      )
        .map(([departmentName, counts]) => ({
          departmentName:
            departmentName.length > 40
              ? departmentName.substring(0, 37) + "..."
              : departmentName,
          staffCount: counts.teaching + counts.nonTeaching,
          teachingStaff: counts.teaching,
          nonTeachingStaff: counts.nonTeaching,
        }))
        .sort((a, b) => b.staffCount - a.staffCount)
        .slice(0, maxDept);

      res.json(chartData);
    },
  );

  // Create new staff
  server.post("/api/staff", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      staffNo,
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      lga,
      departmentId,
      rankId,
      rank,
      cadre,
      religion,
      maritalStatus,
      staffCategory,
      natureOfAppointment,
      conuassContiss,
      dateOfFirstAppointment,
      dateOfLastPromotion,
      status = "Employed",
    } = req.body;

    // Validate required fields
    if (!staffNo || !name || !email || !departmentId || !rankId) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["staffNo", "name", "email", "departmentId", "rankId"],
      });
      return;
    }

    // Check if staff number already exists
    const existingStaff = db.staff.find((s) => s.staffNo === staffNo);
    if (existingStaff) {
      res.status(400).json({ error: "Staff number already exists" });
      return;
    }

    // Check if email already exists
    const existingEmail = db.staff.find((s) => s.email === email);
    if (existingEmail) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // Verify department exists
    const department = db.departments.find((d) => d.id === departmentId);
    if (!department) {
      res.status(400).json({ error: "Invalid department ID" });
      return;
    }

    // Verify rank exists
    const rankDetails = db.ranks.find((r) => r.id === rankId);
    if (!rankDetails) {
      res.status(400).json({ error: "Invalid rank ID" });
      return;
    }

    // Create new staff
    const newStaff = {
      id: `staff_${Date.now()}`,
      staffNo,
      name,
      email,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || "Male",
      address: address || null,
      city: city || null,
      state: state || null,
      lga: lga || null,
      departmentId,
      rankId,
      rank: rank || rankDetails.title,
      religion,
      maritalStatus,
      cadre: cadre || "Non-Teaching",
      staffCategory: staffCategory || "Junior",
      natureOfAppointment: natureOfAppointment || "Permanent",
      conuassContiss: conuassContiss || null,
      dateOfFirstAppointment:
        dateOfFirstAppointment || new Date().toISOString().split("T")[0],
      dateOfLastPromotion: dateOfLastPromotion || null,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.staff.push(newStaff);

    // Create user account for the staff
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      firstName: name,
      lastName: name,
      isActive: true,
      passwordHash: "$2a$10$XQa9Z9Z9Z9Z9Z9Z9Z9Z9Z9",
      role: "staff" as const,
      staffId: newStaff.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDb(db);

    res.status(201).json({
      staff: newStaff,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  });

  // Update new staff
  server.put("/api/staff/:id/details", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const { name, email, phone, joinOn, rankId, departmentId } = req.body;

    // Validate required fields
    if (!name || !email || !departmentId || !rankId) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "departmentId", "rankId"],
      });
      return;
    }
    // Check if staff number already exists
    const existingStaff = db.staff.find((s) => s.staffNo === req.params.id);
    if (existingStaff) {
      res.status(400).json({ error: "Staff number already exists" });
      return;
    }
    // Verify department exists
    const department = db.departments.find((d) => d.id === departmentId);
    if (!department) {
      res.status(400).json({ error: "Invalid department ID" });
      return;
    }

    // Verify rank exists
    const rankDetails = db.ranks.find((r) => r.id === rankId);
    if (!rankDetails) {
      res.status(400).json({ error: "Invalid rank ID" });
      return;
    }

    // Update the existing staff
    const updatedStaff: TStaff = {
      ...existingStaff!,
      name,
      email,
      phone,
      rankId,
      departmentId,
      rank: rankDetails.title,
      dateOfFirstAppointment: joinOn,
      updatedAt: new Date().toISOString(),
    };


    db.staff.map(staff => {
      if (staff.id === req.params.id) {
        return updatedStaff
      }
      return staff
    })

    saveDb(db);

    res.status(200).json({ message: 'Staff profile updated successfully' });
  });

  // Leave balance for a staff member
  server.get(
    "/api/staff/:id/leave/balance",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year } = req.query;
      const currentYear = parseInt(year as string) || new Date().getFullYear();

      const leaveTypes = db.leaveTypes;
      const staffLeaves = db.leaves.filter(
        (leave) =>
          leave.staffId === req.params.id &&
          leave.status === "APPROVED" &&
          new Date(leave.startDate).getFullYear() === currentYear,
      );

      const balance = leaveTypes.map((type) => {
        const usedDays = staffLeaves
          .filter((leave) => leave.leaveTypeId === type.id)
          .reduce((sum, leave) => sum + leave.totalDays, 0);

        return {
          leaveType: type.name,
          allowed: type.allowedDays,
          used: usedDays,
          remaining: type.allowedDays - usedDays,
        };
      });

      res.json(balance);
    },
  );

  // Get staff leave history with pagination
  server.get(
    "/api/staff/:id/leaves",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year, status, page = "1", limit = "20" } = req.query;

      let leaves = db.leaves.filter((l) => l.staffId === req.params.id);

      if (year) {
        leaves = leaves.filter(
          (l) =>
            new Date(l.startDate).getFullYear() === parseInt(year as string),
        );
      }

      if (status) {
        leaves = leaves.filter((l) => l.status === status);
      }

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const total = leaves.length;
      const paginatedLeaves = leaves.slice(startIndex, endIndex);

      const enrichedLeaves = paginatedLeaves.map((leave) => {
        const leaveType = db.leaveTypes.find(
          (lt) => lt.id === leave.leaveTypeId,
        );
        const approver = leave.approverId
          ? db.staff.find((s) => s.id === leave.approverId)
          : null;

        return {
          ...leave,
          leaveType: leaveType?.name,
          approver: approver ? { id: approver.id, name: approver.name } : null,
        };
      });

      res.json({
        data: enrichedLeaves,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: endIndex < total,
          hasPrevPage: pageNum > 1,
        },
      });
    },
  );

  // Leave balance for a staff member
  server.get(
    "/api/staff/:id/leave/balance",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year } = req.query;
      const currentYear = parseInt(year as string) || new Date().getFullYear();

      const leaveTypes = db.leaveTypes;
      const staffLeaves = db.leaves.filter(
        (leave) =>
          leave.staffId === req.params.id &&
          leave.status === "APPROVED" &&
          new Date(leave.startDate).getFullYear() === currentYear,
      );

      const balance = leaveTypes.map((type) => {
        const usedDays = staffLeaves
          .filter((leave) => leave.leaveTypeId === type.id)
          .reduce((sum, leave) => sum + leave.totalDays, 0);

        return {
          leaveType: type.name,
          allowed: type.allowedDays,
          used: usedDays,
          remaining: type.allowedDays - usedDays,
        };
      });

      res.json(balance);
    },
  );

  // GET /api/staff/:id/qualifications/highest
  server.get(
    "/api/staff/:id/qualifications/highest",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const staffId = req.params.id;

      const staff = db.staff.find((s) => s.id === staffId);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const qualifications = (db.qualifications || []).filter(
        (q) => q.staffId === staffId,
      );

      const highest = qualifications.find((q) => q.isHighest === true) || null;
      res.json(highest);
    },
  );

  // employee dashboard endpoint
  server.get(
    "/api/staff/:id/dashboard",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();

      // ✅ Get staffId from URL
      const staffId = req.params.id;

      if (!staffId) {
        res.status(400).json({ message: "Staff ID is required" });
        return;
      }

      // ── STAFF ─────────────────────────────────────────
      const staff = db.staff.find((s) => s.id === staffId);

      if (!staff) {
        res.status(404).json({ message: "Staff not found" });
        return;
      }

      const department = db.departments.find(
        (d) => d.id === staff.departmentId,
      );

      const rank = db.ranks.find((r) => r.id === staff.rankId);

      // ── LEAVE BALANCES ────────────────────────────────
      const staffLeaves = db.leaves.filter((l) => l.staffId === staffId);

      const leaveBalances = db.leaveTypes.map((type) => {
        const used = staffLeaves
          .filter((l) => l.leaveTypeId === type.id && l.status === "APPROVED")
          .reduce((sum, l) => sum + l.totalDays, 0);

        return {
          leaveTypeId: type.id,
          name: type.name,
          allowed: type.allowedDays,
          used,
          remaining: type.allowedDays - used,
          paidLeave: type.paidLeave,
          carryForward: type.carryForward,
        };
      });

      const totalLeaveBalance = {
        totalAllowed: leaveBalances.reduce((sum, b) => sum + b.allowed, 0),
        totalUsed: leaveBalances.reduce((sum, b) => sum + b.used, 0),
        totalRemaining: leaveBalances.reduce((sum, b) => sum + b.remaining, 0),
        breakdown: leaveBalances,
      };

      // ── ATTENDANCE (CURRENT MONTH) ────────────────────
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const monthAttendance = db.attendance.filter((a) => {
        if (a.staffId !== staffId) return false;

        const d = new Date(a.date);

        return (
          d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        );
      });

      const presentDays = monthAttendance.filter(
        (a) => a.status === "PRESENT" || a.status === "LATE",
      ).length;

      const attendanceRate =
        monthAttendance.length > 0
          ? Number(((presentDays / monthAttendance.length) * 100).toFixed(1))
          : 0;

      const attendance = {
        totalDays: monthAttendance.length,
        present: monthAttendance.filter((a) => a.status === "PRESENT").length,
        absent: monthAttendance.filter((a) => a.status === "ABSENT").length,
        late: monthAttendance.filter((a) => a.status === "LATE").length,
        onLeave: monthAttendance.filter((a) => a.status === "ON_LEAVE").length,
        rate: `${attendanceRate}%`,
        workHours:
          monthAttendance.length > 0
            ? Number(
              (
                monthAttendance.reduce(
                  (sum, a) => sum + (a.workHours || 0),
                  0,
                ) / monthAttendance.length
              ).toFixed(2),
            )
            : 0,
      };

      // ── SALARY ────────────────────────────────────────
      const latestPayroll =
        db.payrolls
          .filter((p) => p.staffId === staffId)
          .sort(
            (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime(),
          )[0] ?? null;

      const salary = latestPayroll
        ? {
          netSalary: latestPayroll.netSalary,
          month: latestPayroll.month,
          status: latestPayroll.status,
        }
        : null;

      // ── RECENT LEAVES ─────────────────────────────────
      const recentLeaves = staffLeaves
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )
        .slice(0, 5)
        .map((l) => {
          const type = db.leaveTypes.find((t) => t.id === l.leaveTypeId);

          return {
            id: l.id,
            leaveType: type?.name ?? "Unknown",
            startDate: l.startDate,
            endDate: l.endDate,
            totalDays: l.totalDays,
            status: l.status,
            reason: l.reason,
          };
        });

      // ── RESPONSE ──────────────────────────────────────
      res.json({
        staffId,
        name: staff.name,
        department: department?.name ?? null,
        rank: rank?.title ?? staff.rank,
        leaveBalance: totalLeaveBalance,
        leavePercent:
          totalLeaveBalance.totalAllowed > 0
            ? (totalLeaveBalance.totalUsed / totalLeaveBalance.totalAllowed) *
            100
            : 0,
        attendance,
        salary,
        recentLeaves,
      });
    },
  );

  // Staff with department and rank details
  server.get(
    "/api/staff/:id/details",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const staff = db.staff.find((s) => s.id === req.params.id);

      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const department = db.departments.find(
        (d) => d.id === staff.departmentId,
      );
      const rankDetails = db.ranks.find((r) => r.id === staff.rankId);
      const user = db.users.find((u) => u.staffId === staff.id);

      const details: TStaffDetails = {
        ...staff,
        department,
        rankDetails,
        user,
      };

      res.json(details);
    },
  );

  // Attendance summary for a staff member
  server.get(
    "/api/staff/:id/qualifications",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const staffId = req.params.id;

      const staff = db.staff.find((s) => s.id === staffId);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const qualifications = db.qualifications.filter(
        (q) => q.staffId === staffId,
      );

      res.json(qualifications);
    },
  );

  // ========================================
  // UPDATE EMPLOYEE STATUS
  // ========================================
  server.patch(
    "/api/staff/:id/status",
    (req: TAuthRequest, res: Response) => {
      const db = getDb();
      const { id } = req.params;
      const { status } = req.body as TStaffUpdateStatusRequest;

      // Validation
      if (!status) {
        res.status(400).json({
          success: false,
          message: "Status is required",
        });
        return;
      }


      // Find employee
      const staff = db.staff?.find((e) => e.id === id);

      if (!staff) {
        res.status(404).json({
          success: false,
          message: "Employee not found",
        });
        return;
      }

      // Update status
      staff.status = status;
      saveDb(db);

      // Build updated profile
      const department = db.departments?.find((d) => d.id === staff.departmentId);
      const rankDetails = db.ranks.find((r) => r.id === staff.rankId);
      const user = db.users.find((u) => u.staffId === staff.id);


      const response: TStaffUpdateStatusResponse = {
        success: true,
        message: "Employee status updated successfully",
        staff: {
          ...staff,
          department,
          rankDetails,
          user,
        }
      };

      res.json(response);
    }
  );
}
