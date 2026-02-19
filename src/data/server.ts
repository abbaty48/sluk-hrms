import type { Response, NextFunction } from "express";
import jsonServer from "json-server";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import type {
  Database,
  AuthRequest,
  User,
  DashboardStats,
  AttendanceSummary,
  LeaveBalance,
  DepartmentSummary,
  StaffDetails,
  EnrichedStaff,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  StaffStatistics,
  StaffPerDepartment,
  MonthlyAttendanceTrend,
  LeaveTypeDistribution,
  LeaveApplication,
  LeaveApproval,
  LeaveCalendarEntry,
  LeaveConflict,
  LeaveTrend,
  LeaveUtilization,
  LeaveEligibility,
  LeaveValidation,
  LeaveStatus,
} from "../types/types";

// Get current directory
const filename =
  typeof __filename !== "undefined"
    ? __filename
    : fileURLToPath(import.meta.url);
const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(filename);

// Initialize server
const server = jsonServer.create();

// Find db.json
const possiblePaths = [
  path.join(dirname, "../../db.json"),
  path.join(dirname, "../db.json"),
  path.join(process.cwd(), "db.json"),
  path.join(process.cwd(), "src/data/db.json"),
];

const dbPath: string =
  possiblePaths.find((p) => fs.existsSync(p)) ||
  path.join(process.cwd(), "db.json");

console.log(`📂 Loading database from: ${dbPath}`);

if (!fs.existsSync(dbPath)) {
  console.error("❌ ERROR: db.json not found!");
  console.error("Searched in:");
  possiblePaths.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Enable CORS
server.use((req, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Authentication middleware
const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.startsWith("Bearer ")) {
    req.user = {
      id: "user_1",
      email: "admin@slukh.edu.ng",
      role: "ADMIN",
      staffId: "staff_1",
    };
    next();
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
};

// Helper function to get database
const getDb = (): Database => {
  return router.db.getState() as Database;
};

// Login endpoint
server.post("/api/auth/login", (req: AuthRequest, res: Response): void => {
  const { email }: LoginRequest = req.body;

  const db = getDb();
  const user = db.users.find((u) => u.email === email);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = "mock_jwt_token_" + Date.now();
  const staff = db.staff.find((s) => s.id === user.staffId);

  const response: LoginResponse = {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      staff: staff,
    },
  };

  res.json(response);
});

// Register endpoint
server.post("/api/auth/register", (req: AuthRequest, res: Response): void => {
  const { email, staffId }: RegisterRequest = req.body;

  const db = getDb();
  const existingUser = db.users.find((u) => u.email === email);

  if (existingUser) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const newUser: User = {
    id: "user_" + Date.now(),
    email,
    passwordHash: "$2a$10$XQa9Z9Z9Z9Z9Z9Z9Z9Z9Z9",
    role: "EMPLOYEE",
    staffId: staffId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  const response: RegisterResponse = {
    message: "User created successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  };

  res.status(201).json(response);
});

// Dashboard stats endpoint with month-over-month comparisons
server.get("/api/dashboard/stats", (_req: AuthRequest, res: Response): void => {
  const db = getDb();

  const totalStaff = db.staff.length;
  const activeStaff = db.staff.filter((s) => s.status === "Employed").length;
  const onLeaveToday = db.staff.filter((s) => s.status === "On Leave").length;
  const teachingStaff = db.staff.filter((s) => s.cadre === "Teaching").length;
  const nonTeachingStaff = db.staff.filter(
    (s) => s.cadre === "Non-Teaching",
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = db.attendance.filter((a) => a.date.startsWith(today));

  const presentToday = todayAttendance.filter(
    (a) => a.status === "PRESENT" || a.status === "LATE",
  ).length;

  const attendanceRate =
    totalStaff > 0 ? ((presentToday / totalStaff) * 100).toFixed(1) : "0";

  const pendingLeaves = db.leaves.filter((l) => l.status === "PENDING").length;

  // Calculate month-over-month changes (simulated with reasonable values)
  // In production, you would calculate these from historical data
  const totalStaffChange = 2.3; // 2.3% increase from last month
  const activeStaffChange = 1.8; // 1.8% increase
  const onLeaveChange = -12.5; // 12.5% decrease (fewer on leave)
  const attendanceRateChange = 3.2; // 3.2% improvement

  const stats: DashboardStats = {
    totalStaff,
    totalStaffChange,
    activeStaff,
    activeStaffChange,
    presentToday,
    onLeaveToday,
    onLeaveChange,
    attendanceRate,
    attendanceRateChange,
    pendingActions: pendingLeaves,
    lateArrivals: todayAttendance.filter((a) => a.status === "LATE").length,
    avgWorkHours: 8.0,
    teachingStaff,
    nonTeachingStaff,
    totalDepartments: db.departments.length,
  };

  res.json(stats);
});

// Staff with department and rank details
server.get(
  "/api/staff/:id/details",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const staff = db.staff.find((s) => s.id === req.params.id);

    if (!staff) {
      res.status(404).json({ error: "Staff not found" });
      return;
    }

    const department = db.departments.find((d) => d.id === staff.departmentId);
    const rankDetails = db.ranks.find((r) => r.id === staff.rankId);
    const user = db.users.find((u) => u.staffId === staff.id);

    const details: StaffDetails = {
      ...staff,
      department,
      rankDetails,
      user,
    };

    res.json(details);
  },
);

// Get all ranks with optional filtering
server.get("/api/ranks", (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const { level, search } = req.query;

  let ranks = db.ranks;

  // Filter by level
  if (level) {
    ranks = ranks.filter((r) => r.level === parseInt(level as string));
  }

  // Search by title
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    ranks = ranks.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm) ||
        (r.description && r.description.toLowerCase().includes(searchTerm)),
    );
  }

  // Sort by level (ascending)
  ranks = ranks.sort((a, b) => a.level - b.level);

  res.json({
    data: ranks,
  });
});

// Attendance summary for a staff member
server.get(
  "/api/staff/:id/attendance/summary",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { month, year } = req.query;

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

    const summary: AttendanceSummary = {
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

    res.json(summary);
  },
);

// Leave balance for a staff member
server.get(
  "/api/staff/:id/leave/balance",
  (req: AuthRequest, res: Response): void => {
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

    const balance: LeaveBalance[] = leaveTypes.map((type) => {
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

// Department filter
server.get("/api/departments", (_req: AuthRequest, res: Response): void => {
  const db = getDb();

  const departments = db.departments.map((dept) => {
    return {
      id: dept.id,
      name: dept.name,
    };
  });

  res.json(departments);
});

// Department summary
server.get(
  "/api/departments/summary",
  (_req: AuthRequest, res: Response): void => {
    const db = getDb();

    const summary: DepartmentSummary[] = db.departments.map((dept) => {
      const deptStaff = db.staff.filter((s) => s.departmentId === dept.id);

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        staffCount: deptStaff.length,
        teachingStaff: deptStaff.filter((s) => s.cadre === "Teaching").length,
        nonTeachingStaff: deptStaff.filter((s) => s.cadre === "Non-Teaching")
          .length,
        seniorStaff: deptStaff.filter((s) => s.staffCategory === "Senior")
          .length,
        juniorStaff: deptStaff.filter((s) => s.staffCategory === "Junior")
          .length,
      };
    });

    res.json(summary);
  },
);

// Staff statistics
server.get(
  "/api/staff/statistics",
  (_req: AuthRequest, res: Response): void => {
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

    const stats: StaffStatistics = {
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
server.get("/api/staff/search", (req: AuthRequest, res: Response): void => {
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

  const enrichedStaff: EnrichedStaff[] = paginatedStaff
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
        return b.department?.name.localeCompare(a.department?.name || "") || 0;
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
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { limit } = req.query;
    const maxDepts = limit ? parseInt(limit as string) : 10;

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
    const chartData: StaffPerDepartment[] = Array.from(
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
      .slice(0, maxDepts);

    res.json(chartData);
  },
);

// Add staff

// Monthly attendance trend (for line/area chart)
server.get(
  "/api/charts/monthly-attendance-trend",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { months } = req.query;
    const monthCount = months ? parseInt(months as string) : 6;

    // Generate trend data for the last N months
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
    const trendData: MonthlyAttendanceTrend[] = [];

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Simulate realistic attendance data with slight variations
      const totalStaff = db.staff.length;
      const baseAttendanceRate = 0.92; // 92% base attendance rate
      const variance = Math.random() * 0.08 - 0.04; // ±4% variance
      const attendanceRate = Math.min(
        0.98,
        Math.max(0.85, baseAttendanceRate + variance),
      );

      const present = Math.floor(totalStaff * attendanceRate);
      const late = Math.floor(totalStaff * 0.03); // 3% late
      const onLeave = Math.floor(totalStaff * 0.02); // 2% on leave
      const absent = totalStaff - present - late - onLeave;

      trendData.push({
        month: `${monthName} ${year}`,
        present,
        absent: Math.max(0, absent),
        late,
        onLeave,
        attendanceRate: parseFloat((attendanceRate * 100).toFixed(1)),
      });
    }

    res.json(trendData);
  },
);

// Create new staff
server.post("/api/staff", (req: AuthRequest, res: Response): void => {
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
    passwordHash: "$2a$10$XQa9Z9Z9Z9Z9Z9Z9Z9Z9Z9",
    role: "EMPLOYEE" as const,
    staffId: newStaff.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  res.status(201).json({
    staff: newStaff,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Leave type distribution (for pie chart)
server.get(
  "/api/charts/leave-type-distribution",
  (req: AuthRequest, res: Response): void => {
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
      const leaveType = db.leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
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

    const chartData: LeaveTypeDistribution[] = Array.from(
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

// ============================================
// LEAVE MANAGEMENT ENDPOINTS
// ============================================

// Apply for leave
server.post("/api/leaves", (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const { staffId, leaveTypeId, startDate, endDate, reason }: LeaveApplication =
    req.body;

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
    status: "PENDING" as LeaveStatus,
    approverId: null,
    approverComments: null,
    appliedAt: new Date().toISOString(),
    respondedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.leaves.push(newLeave);
  res.status(201).json(newLeave);
});

// Approve/Reject leave
server.patch(
  "/api/leaves/:id/:status",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { comments }: LeaveApproval = req.body;
    const leave = db.leaves.find((l) => l.id === req.params.id);

    if (!leave) {
      res.status(404).json({ error: "Leave not found" });
      return;
    }

    if (leave.status !== "PENDING") {
      res.status(400).json({ error: "Leave already processed" });
      return;
    }

    leave.status = req.params.status as LeaveStatus;
    leave.approverComments = comments;
    leave.approverId = req.user?.staffId || null;
    leave.respondedAt = new Date().toISOString();
    leave.updatedAt = new Date().toISOString();

    res.json(leave);
  },
);

// Get pending leave approvals with pagination
server.get("/api/leaves/pending", (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const { departmentId, page = "1", limit = "5" } = req.query;

  let pendingLeaves = db.leaves.filter((l) => l.status === "PENDING");

  if (departmentId) {
    const deptStaff = db.staff
      .filter((s) => s.departmentId === departmentId)
      .map((s) => s.id);
    pendingLeaves = pendingLeaves.filter((l) => deptStaff.includes(l.staffId));
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
    const leaveType = db.leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
    const department = db.departments.find((d) => d.id === staff?.departmentId);

    return {
      ...leave,
      staff: {
        id: staff?.id,
        name: staff?.name,
        staffNo: staff?.staffNo,
        department: department?.name,
      },
      leaveType: leaveType?.name,
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
});

// Get staff leave history with pagination
server.get("/api/staff/:id/leaves", (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const { year, status, page = "1", limit = "20" } = req.query;

  let leaves = db.leaves.filter((l) => l.staffId === req.params.id);

  if (year) {
    leaves = leaves.filter(
      (l) => new Date(l.startDate).getFullYear() === parseInt(year as string),
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
    const leaveType = db.leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
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
});

// Team leave calendar
server.get(
  "/api/departments/:id/leaves/calendar",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { month, year } = req.query;

    const deptStaff = db.staff.filter((s) => s.departmentId === req.params.id);
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

    const calendar: LeaveCalendarEntry[] = [];
    leaves.forEach((leave) => {
      const staff = deptStaff.find((s) => s.id === leave.staffId);
      const leaveType = db.leaveTypes.find((lt) => lt.id === leave.leaveTypeId);

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
server.get("/api/leaves/conflicts", (req: AuthRequest, res: Response): void => {
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

  const conflict: LeaveConflict = {
    conflictCount: conflictingLeaves.length,
    staffOnLeave: staffNames,
    details,
  };

  res.json(conflict);
});

// Leave eligibility check
server.get(
  "/api/staff/:id/leave/eligibility",
  (req: AuthRequest, res: Response): void => {
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

    const eligibility: LeaveEligibility = {
      eligible: remainingDays > 0,
      remainingDays,
      reason: remainingDays <= 0 ? "No leave balance remaining" : undefined,
      warnings:
        remainingDays < 5 && remainingDays > 0 ? ["Low leave balance"] : [],
    };

    res.json(eligibility);
  },
);

// Validate leave application
server.post("/api/leaves/validate", (req: AuthRequest, res: Response): void => {
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
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
      if (!deptStaff.includes(l.staffId) || l.staffId === staffId) return false;
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

  const validation: LeaveValidation = {
    valid: errors.length === 0,
    errors,
    warnings,
    conflicts,
  };

  res.json(validation);
});

// Leave trends chart
server.get(
  "/api/charts/leave-trends",
  (req: AuthRequest, res: Response): void => {
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
    const trends: LeaveTrend[] = [];

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

// Leave utilization by department
server.get(
  "/api/charts/leave-utilization",
  (req: AuthRequest, res: Response): void => {
    const db = getDb();
    const { year } = req.query;
    const targetYear = year
      ? parseInt(year as string)
      : new Date().getFullYear();

    const utilization: LeaveUtilization[] = db.departments
      .map((dept) => {
        const deptStaff = db.staff.filter((s) => s.departmentId === dept.id);
        const staffCount = deptStaff.length;
        const totalAllowed = staffCount * 30;

        const deptStaffIds = deptStaff.map((s) => s.id);
        const utilized = db.leaves
          .filter(
            (l) =>
              deptStaffIds.includes(l.staffId) &&
              l.status === "APPROVED" &&
              new Date(l.startDate).getFullYear() === targetYear,
          )
          .reduce((sum, l) => sum + l.totalDays, 0);

        const remaining = totalAllowed - utilized;
        const utilizationRate =
          totalAllowed > 0
            ? parseFloat(((utilized / totalAllowed) * 100).toFixed(1))
            : 0;

        return {
          department:
            dept.name.length > 40
              ? dept.name.substring(0, 37) + "..."
              : dept.name,
          departmentId: dept.id,
          totalAllowed,
          utilized,
          remaining,
          utilizationRate,
        };
      })
      .filter((u) => u.totalAllowed > 0)
      .sort((a, b) => b.utilizationRate - a.utilizationRate)
      .slice(0, 15);

    res.json(utilization);
  },
);

// Apply auth middleware to protected routes
server.use("/api/*", authMiddleware);

// Use default router
server.use(router);

// Start server
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 JSON Server is running");
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📊 Resources: http://localhost:${PORT}/api`);
  console.log("\n📚 Available Endpoints:");
  console.log("  POST   /api/auth/login");
  console.log("  POST   /api/auth/register");
  console.log("  GET    /api/dashboard/stats");
  console.log("  GET    /api/staff");
  console.log("  POST   /api/staff");
  console.log("  GET    /api/staff/:id");
  console.log("  GET    /api/staff/:id/details");
  console.log("  GET    /api/staff/:id/attendance/summary");
  console.log("  GET    /api/staff/:id/leave/balance");
  console.log(
    "  GET    /api/staff/search?q=name&department=dept_1&page=1&limit=20",
  );
  console.log("  GET    /api/staff/statistics");
  console.log("  GET    /api/departments");
  console.log("  GET    /api/departments/summary");
  console.log("  GET    /api/ranks?level=5&search=professor&page=1&limit=50");
  console.log("  GET    /api/attendance");
  console.log("  GET    /api/leaves");
  console.log("  GET    /api/leaveTypes");
  console.log("  GET    /api/payrolls");
  console.log("  GET    /api/documents");
  console.log("  GET    /api/announcements");
  console.log("\n📊 Chart Data Endpoints:");
  console.log("  GET    /api/charts/staff-per-department?limit=10");
  console.log("  GET    /api/charts/monthly-attendance-trend?months=6");
  console.log("  GET    /api/charts/leave-type-distribution?year=2025");
  console.log("  GET    /api/charts/leave-trends?months=12");
  console.log("  GET    /api/charts/leave-utilization?year=2025");
  console.log("\n🏖️  Leave Management Endpoints:");
  console.log("  POST   /api/leaves");
  console.log("  PATCH  /api/leaves/:id/status");
  console.log("  GET    /api/leaves/pending?departmentId=dept_1");
  console.log("  GET    /api/staff/:id/leaves?year=2025&status=APPROVED");
  console.log(
    "  GET    /api/departments/:id/leaves/calendar?month=2&year=2025",
  );
  console.log(
    "  GET    /api/leaves/conflicts?departmentId=dept_1&startDate=...&endDate=...",
  );
  console.log("  GET    /api/staff/:id/leave/eligibility?leaveTypeId=lt_1");
  console.log("  POST   /api/leaves/validate");
  console.log("\n💡 Tip: Use ?_embed to include related resources");
  console.log("💡 Example: /api/staff?_expand=department");
});
