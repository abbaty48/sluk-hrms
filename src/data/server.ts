import jsonServer from "json-server";
import type { Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import type {
  Database,
  AuthRequest,
  User,
  DashboardStats,
  AttendanceSummary,
  LeaveBalance,
  DepartmentPayrollSummary,
  RecruitmentPipeline,
  PerformanceSummary,
  EmployeeDetails,
  EnrichedEmployee,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/types";

// Get current directory (works with both CommonJS and ES modules)
const filename =
  typeof __filename !== "undefined"
    ? __filename
    : fileURLToPath(import.meta.url);
const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(filename);

// Initialize server
const server = jsonServer.create();

// Find db.json - check multiple possible locations
const possiblePaths = [
  path.join(dirname, "../../db.json"), // From dist/src/server.js
  path.join(dirname, "../db.json"), // From src/server.ts
  path.join(process.cwd(), "db.json"), // From project root
  path.join(process.cwd(), "src/data/db.json"), // If in src/data
];

// Find the first existing db.json
import fs from "fs";
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

// Use default middlewares (logger, static, cors, no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Custom authentication middleware (mock)
const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  // Skip auth for OPTIONS requests
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  // Mock authentication - in real app, verify JWT token
  const authHeader = req.headers.authorization;

  // For demo purposes, allow requests without auth or with any Bearer token
  if (!authHeader || authHeader.startsWith("Bearer ")) {
    req.user = {
      id: "user_1",
      email: "admin@peoplesync.com",
      role: "SUPER_ADMIN",
      employeeId: "emp_1",
    };
    next();
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
};

server.get("/api/employees", (_req: AuthRequest, res: Response): void => {
  const db = router.db as unknown as Database;
  const employees = db.__wrapped__.employees;
  res.json(employees);
});

// Login endpoint
server.post("/api/auth/login", (req: AuthRequest, res: Response): void => {
  const { email }: LoginRequest = req.body;

  // Mock authentication - in real app, verify password hash
  const db = router.db as unknown as Database;
  const user = db.__wrapped__.users.find((u) => u.email === email);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Mock successful login
  const token = "mock_jwt_token_" + Date.now();
  const employee = db.__wrapped__.employees.find(
    (e) => e.id === user.employeeId,
  );

  const response: LoginResponse = {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      employee: employee,
    },
  };

  res.json(response);
});

// Register endpoint
server.post("/api/auth/register", (req: AuthRequest, res: Response): void => {
  const { email, employeeId }: RegisterRequest = req.body;

  const db = router.db as unknown as Database;
  const existingUser = db.__wrapped__.users.find((u) => u.email === email);

  if (existingUser) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const newUser: User = {
    id: "user_" + Date.now(),
    email,
    passwordHash: "$2a$10$XQa9Z9Z9Z9Z9Z9Z9Z9Z9Z9", // Mock hash
    role: "EMPLOYEE",
    employeeId: employeeId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.__wrapped__.users.push(newUser);

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

// Dashboard stats endpoint
server.get("/api/dashboard/stats", (_req: AuthRequest, res: Response): void => {
  const db = router.db as unknown as Database;

  const totalEmployees = db.__wrapped__.employees?.length || 0;
  const activeEmployees = db.__wrapped__.employees.filter(
    (e) => e.status === "ACTIVE",
  ).length;
  const onLeaveToday = db.__wrapped__.employees.filter(
    (e) => e.status === "ON_LEAVE",
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = db.__wrapped__.attendance.filter((a) =>
    a.date.startsWith(today),
  );

  const presentToday = todayAttendance.filter(
    (a) => a.status === "PRESENT" || a.status === "LATE",
  ).length;

  const attendanceRate =
    totalEmployees > 0
      ? ((presentToday / totalEmployees) * 100).toFixed(1)
      : "0";

  const pendingLeaves = db.__wrapped__.leaves.filter(
    (l) => l.status === "PENDING",
  ).length;
  const pendingActions = pendingLeaves; // Can add more pending items

  const stats: DashboardStats = {
    totalEmployees,
    activeEmployees,
    presentToday,
    onLeaveToday,
    attendanceRate,
    pendingActions,
    lateArrivals: todayAttendance.filter((a) => a.status === "LATE").length,
    avgWorkHours: 8.4,
  };

  res.json(stats);
});

// Employee with department and designation details
server.get(
  "/api/employees/:id/details",
  (req: AuthRequest, res: Response): void => {
    const db = router.db as unknown as Database;
    const employee = db.__wrapped__.employees.find(
      (e) => e.id === req.params.id,
    );

    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    const department = db.__wrapped__.departments.find(
      (d) => d.id === employee.departmentId,
    );
    const designation = db.__wrapped__.designations.find(
      (d) => d.id === employee.designationId,
    );
    const manager = employee.managerId
      ? db.__wrapped__.employees.find((e) => e.id === employee.managerId)
      : null;

    const details: EmployeeDetails = {
      ...employee,
      department,
      designation,
      manager: manager
        ? {
            id: manager.id,
            firstName: manager.firstName,
            lastName: manager.lastName,
            email: manager.email,
          }
        : null,
    };

    res.json(details);
  },
);

// Attendance summary for an employee
server.get(
  "/api/employees/:id/attendance/summary",
  (req: AuthRequest, res: Response): void => {
    const db = router.db as unknown as Database;
    const { month, year } = req.query;

    let attendanceRecords = db.__wrapped__.attendance.filter(
      (a) => a.employeeId === req.params.id,
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

// Leave balance for an employee
server.get(
  "/api/employees/:id/leave/balance",
  (req: AuthRequest, res: Response): void => {
    const db = router.db as unknown as Database;
    const { year } = req.query;
    const currentYear = parseInt(year as string) || new Date().getFullYear();

    const leaveTypes = db.__wrapped__.leaveTypes;
    const employeeLeaves = db.__wrapped__.leaves.filter(
      (leave) =>
        leave.employeeId === req.params.id &&
        leave.status === "APPROVED" &&
        new Date(leave.startDate).getFullYear() === currentYear,
    );

    const balance: LeaveBalance[] = leaveTypes.map((type) => {
      const usedDays = employeeLeaves
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

// Payroll summary by department
server.get("/api/payroll/summary", (req: AuthRequest, res: Response): void => {
  const db = router.db as unknown as Database;
  const { month, year } = req.query;

  let payrolls = db.__wrapped__.payrolls;

  if (month && year) {
    payrolls = payrolls.filter(
      (p) =>
        p.month === parseInt(month as string) &&
        p.year === parseInt(year as string),
    );
  }

  const departments = db.__wrapped__.departments;
  const employees = db.__wrapped__.employees;

  const summary: DepartmentPayrollSummary[] = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.departmentId === dept.id);
    const deptPayrolls = payrolls.filter((p) =>
      deptEmployees.some((e) => e.id === p.employeeId),
    );

    const totalGross = deptPayrolls.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalNet = deptPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalDeductions = totalGross - totalNet;

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      employeeCount: deptEmployees.length,
      totalGrossSalary: totalGross,
      totalDeductions,
      totalNetSalary: totalNet,
    };
  });

  res.json(summary);
});

// Recruitment pipeline stats
server.get(
  "/api/recruitment/pipeline",
  (_req: AuthRequest, res: Response): void => {
    const db = router.db as unknown as Database;

    const applications = db.__wrapped__.applications;

    const pipeline: RecruitmentPipeline = {
      total: applications.length,
      applied: applications.filter((a) => a.status === "APPLIED").length,
      screening: applications.filter((a) => a.status === "SCREENING").length,
      interview: applications.filter((a) => a.status === "INTERVIEW").length,
      offered: applications.filter((a) => a.status === "OFFERED").length,
      hired: applications.filter((a) => a.status === "HIRED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
    };

    res.json(pipeline);
  },
);

// Performance review summary
server.get(
  "/api/performance/summary",
  (req: AuthRequest, res: Response): void => {
    const db = router.db as unknown as Database;
    const { period } = req.query;

    let reviews = db.__wrapped__.performanceReviews;

    if (period) {
      reviews = reviews.filter((r) => r.reviewPeriod === period);
    }

    const summary: PerformanceSummary = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.overallRating, 0) /
              reviews.length
            ).toFixed(2)
          : "0",
      submitted: reviews.filter((r) => r.status === "SUBMITTED").length,
      draft: reviews.filter((r) => r.status === "DRAFT").length,
      topPerformers: reviews
        .sort((a, b) => b.overallRating - a.overallRating)
        .slice(0, 5)
        .map((r) => ({
          employeeId: r.employeeId,
          rating: r.overallRating,
          period: r.reviewPeriod,
        })),
    };

    res.json(summary);
  },
);

// Search employees
server.get("/api/employees/search", (req: AuthRequest, res: Response): void => {
  const db = router.db as unknown as Database;
  const { q, department, status } = req.query;

  let employees = db.__wrapped__.employees;

  if (q) {
    const searchTerm = (q as string).toLowerCase();
    employees = employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(searchTerm) ||
        e.lastName.toLowerCase().includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm) ||
        e.employeeCode.toLowerCase().includes(searchTerm),
    );
  }

  if (department) {
    employees = employees.filter((e) => e.departmentId === department);
  }

  if (status) {
    employees = employees.filter((e) => e.status === status);
  }

  // Add department and designation details
  const departments = db.__wrapped__.departments;
  const designations = db.__wrapped__.designations;

  const enrichedEmployees: EnrichedEmployee[] = employees.map((emp) => ({
    ...emp,
    department: departments.find((d) => d.id === emp.departmentId),
    designation: designations.find((d) => d.id === emp.designationId),
  }));

  res.json(enrichedEmployees);
});

// Apply auth middleware to protected routes
server.use("/api/*", authMiddleware);

// Rewrite routes to add /api prefix
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  }),
);

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
  console.log("  GET    /api/employees");
  console.log("  GET    /api/employees/:id");
  console.log("  GET    /api/employees/:id/details");
  console.log("  GET    /api/employees/:id/attendance/summary");
  console.log("  GET    /api/employees/:id/leave/balance");
  console.log("  GET    /api/employees/search?q=name&department=dept_1");
  console.log("  GET    /api/departments");
  console.log("  GET    /api/designations");
  console.log("  GET    /api/attendance");
  console.log("  GET    /api/leaves");
  console.log("  GET    /api/leaveTypes");
  console.log("  GET    /api/payrolls");
  console.log("  GET    /api/payroll/summary?month=2&year=2026");
  console.log("  GET    /api/jobPostings");
  console.log("  GET    /api/applications");
  console.log("  GET    /api/interviews");
  console.log("  GET    /api/recruitment/pipeline");
  console.log("  GET    /api/performanceReviews");
  console.log("  GET    /api/performance/summary");
  console.log("  GET    /api/documents");
  console.log("  GET    /api/announcements");
  console.log("\n💡 Tip: Use ?_embed to include related resources");
  console.log("💡 Example: /api/employees?_embed=attendance");
});
