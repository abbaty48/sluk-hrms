import type {
  TDatabase,
  TAuthRequest,
  TDashboardStats,
} from "@/types/types";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";
import type { Response, NextFunction } from "express";
import { hrmsAUTH_ENDPOINTS } from "./auth-endpoints.ts";
import { hrmsRANK_ENDPOINTS } from "./ranks-api-endpoints.ts";
import { hrmsLEAVE_ENDPOINTS } from "./leave-api-endpoints.ts";
import { hrmsSTAFF_ENDPOINTS } from "./staff-api-endpoints.ts";
import { hrmsSETTINGS_ENDPOINTS } from "./settings-endpoints.ts";
import { hrmsANALYTICS_ENDPOINTS } from "./analytic-api-endpoints.ts";
import { hrmsATTENDANCE_ENDPOINTS } from "./attendance-api-endpoints.ts";
import { hrmsCOMMITTEES_ENDPOINTS } from "./committees-api-endpoints.ts";
import { hrmsDEPARTMENT_ENDPOINTS } from "./department-api-endpoints.ts";
import { hrmsNOTIFICATION_ENDPOINTS } from "./notifications-endpoints.ts";
import type { TMonthlyAttendanceTrend } from "../types/attendance.types.ts";
import { hrmsAPPOINTMENT_ENDPOINTS } from "./appointments-api-endpoints.ts";
import { hrmsQUALIFICATION_ENDPOINTS } from "./qualification-api-endpoints.ts";
import { hrmsRESPONSIBILITY_ENDPOINTS } from "./responsibility-api-endpoints.ts";

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
  req: TAuthRequest,
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

// Global database cache
let dbCache: TDatabase | null = null;

/**
 * Get database - loads from file or returns cached version
 */
function getDb(): TDatabase {
  if (dbCache) {
    return dbCache;
  }

  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    dbCache = JSON.parse(data);
    return dbCache as TDatabase;
  } catch (error) {
    console.error("Error reading database:", error);
    throw new Error("Failed to read database");
  }
}

/**
 * Save database - writes changes to file
 * @param db - The database object to save
 */
function saveDb(db: TDatabase): void {
  try {
    // Update cache
    dbCache = db;

    // Write to file with pretty formatting
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database:", error);
    throw new Error("Failed to save database");
  }
}

/**
 * Reload database from file (useful for clearing cache)
 */
export function reloadDb(): TDatabase {
  dbCache = null;
  return getDb();
}

/**
 * Backup database to a timestamped file
 */
export function backupDb(): string {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(process.cwd(), `db.backup.${timestamp}.json`);

    const db = getDb();
    fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), "utf-8");

    console.log(`Database backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error("Error backing up database:", error);
    throw new Error("Failed to backup database");
  }
}

// Alternative implementation with debouncing (prevents too many writes)
// Useful if you have high-frequency updates

let saveTimeout: NodeJS.Timeout | null = null;
let pendingDb: TDatabase | null = null;

/**
 * Save database with debouncing (waits 100ms before actually writing)
 * @param db - The database object to save
 * @param immediate - If true, saves immediately without debouncing
 */
export function saveDebouncedDb(
  db: TDatabase,
  immediate: boolean = false,
): void {
  pendingDb = db;
  dbCache = db;

  if (immediate) {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
    writeDb(db);
    return;
  }

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    if (pendingDb) {
      writeDb(pendingDb);
      pendingDb = null;
    }
    saveTimeout = null;
  }, 100); // Wait 100ms
}

function writeDb(db: TDatabase): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
    console.log("Database saved successfully");
  } catch (error) {
    console.error("Error writing database:", error);
    throw new Error("Failed to write database");
  }
}

// Dashboard stats endpoint with month-over-month comparisons
server.get(
  "/api/dashboard/stats",
  (_req: TAuthRequest, res: Response): void => {
    const db = getDb();

    const totalStaff = db.staff.length;
    const activeStaff = db.staff.filter((s) => s.status === "Employed").length;
    const onLeaveToday = db.staff.filter((s) => s.status === "On Leave").length;
    const teachingStaff = db.staff.filter((s) => s.cadre === "Teaching").length;
    const nonTeachingStaff = db.staff.filter(
      (s) => s.cadre === "Non-Teaching",
    ).length;

    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = db.attendance.filter((a) =>
      a.date.startsWith(today),
    );

    const presentToday = todayAttendance.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE",
    ).length;

    const attendanceRate =
      totalStaff > 0 ? ((presentToday / totalStaff) * 100).toFixed(1) : "0";

    const pendingLeaves = db.leaves.filter(
      (l) => l.status === "PENDING",
    ).length;

    // Calculate month-over-month changes (simulated with reasonable values)
    // In production, you would calculate these from historical data
    const totalStaffChange = 2.3; // 2.3% increase from last month
    const activeStaffChange = 1.8; // 1.8% increase
    const onLeaveChange = -12.5; // 12.5% decrease (fewer on leave)
    const attendanceRateChange = 3.2; // 3.2% improvement

    const stats: TDashboardStats = {
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
  },
);

// Monthly attendance trend (for line/area chart)
server.get(
  "/api/charts/monthly-attendance-trend",
  (req: TAuthRequest, res: Response): void => {
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
    const trendData: TMonthlyAttendanceTrend[] = [];

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

// ATTENDANCE ENDPOINTS
hrmsANALYTICS_ENDPOINTS(server, getDb);
hrmsAUTH_ENDPOINTS(server, getDb, saveDb);
hrmsRANK_ENDPOINTS(server, getDb, saveDb);
hrmsLEAVE_ENDPOINTS(server, getDb, saveDb);
hrmsSTAFF_ENDPOINTS(server, getDb, saveDb);
hrmsSETTINGS_ENDPOINTS(server, getDb, saveDb);
hrmsCOMMITTEES_ENDPOINTS(server, getDb, saveDb);
hrmsATTENDANCE_ENDPOINTS(server, getDb, saveDb);
hrmsDEPARTMENT_ENDPOINTS(server, getDb, saveDb);
hrmsAPPOINTMENT_ENDPOINTS(server, getDb, saveDb);
hrmsNOTIFICATION_ENDPOINTS(server, getDb, saveDb);
hrmsQUALIFICATION_ENDPOINTS(server, getDb, saveDb);
hrmsRESPONSIBILITY_ENDPOINTS(server, getDb, saveDb);

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
  console.log("💡 Example: /api/staff?_expand=department");
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
  console.log("\n📊 Department Endpoints:");
  console.log("  GET    /api/departments");
  console.log("  GET    /api/departments/summary");
  console.log("\n📊 Others Endpoints:");
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
  console.log("\n🏖️  Report Analytic Endpoints:");
  console.log("  GET    /api/analytics/staff-strength-years");
  console.log("  GET    /api/analytics/staff-by-category");
  console.log("  GET    /api/analytics/staff-by-department");
  console.log("  GET    /api/analytics/monthly-leave-usage");
  console.log("  GET    /api/analytics/payroll-breakdown");
  console.log("  GET    /api/analytics/summary");
  console.log("\n  Notification Endpoints:");
  console.log("  GET    /api/notifications");
  console.log("  GET    /api/notifications/:id");
  console.log("  PATCH  /api/notifications/mark-read");
  console.log("  PATCH  /api/notifications/mark-all-read");
  console.log("  PATCH  /api/notifications/:id/mark-unread");
  console.log("  DELETE /api/notifications/:id");
  console.log("  DELETE /api/notifications/delete-read");
  console.log("  POST   /api/notifications");
  console.log("  GET    /api/notifications/stats");
  console.log("  GET/PATCH `/api/notifications/preferences` ");
  console.log("\n⚙️  Settings Endpoints:");
  console.log("\n💡 Tip: Use ?_embed to include related resources");
});
