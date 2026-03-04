// ========================================
// ATTENDANCE MANAGEMENT ENDPOINTS
// ========================================

import type { TAttendanceStats } from "../types/attendance.types";
import type { TAuthRequest, TDatabase } from "../types/types";
import type { Application, Response } from "express";

export function hrmsATTENDANCE_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {
  // 1. Mark Attendance (Single)
  server.post(
    "/api/attendance/mark",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { staffId, date, status, checkIn, checkOut, notes } = req.body;

      // Validation
      if (!staffId || !date || !status) {
        res
          .status(400)
          .json({ error: "Staff ID, date, and status are required" });
        return;
      }

      // Check if attendance already marked for this date
      const existingAttendance = db.attendance.find(
        (a) => a.staffId === staffId && a.date === date,
      );

      if (existingAttendance) {
        res.status(400).json({
          error: "Attendance already marked for this date",
          existingRecord: existingAttendance,
        });
        return;
      }

      // Calculate work hours if check in and check out provided
      let workHours = 0;
      if (checkIn && checkOut) {
        const inTime = new Date(`${date}T${checkIn}`);
        const outTime = new Date(`${date}T${checkOut}`);
        workHours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
      }

      // Create attendance record
      const newAttendance = {
        id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        staffId,
        date,
        rate: "",
        status, // PRESENT, ABSENT, LATE, ON_LEAVE, HALF_DAY
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        workHours: parseFloat(workHours.toFixed(2)),
        remarks: notes || null,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
      };

      db.attendance.push(newAttendance);
      saveDb(db);

      res.status(201).json({
        message: "Attendance marked successfully",
        attendance: newAttendance,
      });
    },
  );

  // 2. Bulk Mark Attendance
  server.post(
    "/api/attendance/mark/bulk",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { records } = req.body; // Array of attendance records

      if (!records || !Array.isArray(records) || records.length === 0) {
        res.status(400).json({ error: "Records array is required" });
        return;
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [] as any[],
        created: [] as any[],
      };

      records.forEach((record, index) => {
        const { staffId, date, status, checkIn, checkOut, notes } = record;

        // Validation
        if (!staffId || !date || !status) {
          results.failed++;
          results.errors.push({
            index,
            error: "Staff ID, date, and status are required",
            record,
          });
          return;
        }

        // Check for duplicates
        const exists = db.attendance.find(
          (a) => a.staffId === staffId && a.date === date,
        );

        if (exists) {
          results.failed++;
          results.errors.push({
            index,
            error: "Attendance already marked",
            record,
          });
          return;
        }

        // Calculate work hours
        let workHours = 0;
        if (checkIn && checkOut) {
          const inTime = new Date(`${date}T${checkIn}`);
          const outTime = new Date(`${date}T${checkOut}`);
          workHours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
        }

        const newAttendance = {
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          staffId,
          date,
          status,
          rate: "",
          checkIn: checkIn || null,
          checkOut: checkOut || null,
          workHours: parseFloat(workHours.toFixed(2)),
          remarks: notes || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        db.attendance.push(newAttendance);
        results.success++;
        results.created.push(newAttendance);
      });

      saveDb(db);

      res.status(results.failed > 0 ? 207 : 201).json({
        message: `Bulk attendance marking completed`,
        results,
      });
    },
  );

  // 3. Update Attendance
  server.patch(
    "/api/attendance/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;
      const { status, checkIn, checkOut, notes } = req.body;

      const attendance = db.attendance.find((a) => a.id === id);

      if (!attendance) {
        res.status(404).json({ error: "Attendance record not found" });
        return;
      }

      // Update fields
      if (status) attendance.status = status;
      if (checkIn) attendance.checkIn = checkIn;
      if (checkOut) attendance.checkOut = checkOut;
      if (notes !== undefined) attendance.remarks = notes;

      // Recalculate work hours if check times changed
      if (attendance.checkIn && attendance.checkOut) {
        const inTime = new Date(`${attendance.date}T${attendance.checkIn}`);
        const outTime = new Date(`${attendance.date}T${attendance.checkOut}`);
        const hours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
        attendance.workHours = parseFloat(hours.toFixed(2));
      }

      // attendance.updatedBy = req.user?.id || "system";
      attendance.updatedAt = new Date().toISOString();

      saveDb(db);

      res.json({
        message: "Attendance updated successfully",
        attendance,
      });
    },
  );

  // 4. Get Attendance Records (with filters and pagination)
  server.get("/api/attendance", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      staffId,
      departmentId,
      status,
      startDate,
      endDate,
      page = "1",
      limit = "20",
    } = req.query;

    let records = [...db.attendance];

    // Apply filters
    if (staffId) {
      records = records.filter((a) => a.staffId === staffId);
    }

    if (departmentId) {
      const deptStaff = db.staff.filter((s) => s.departmentId === departmentId);
      const staffIds = deptStaff.map((s) => s.id);
      records = records.filter((a) => staffIds.includes(a.staffId));
    }

    if (status) {
      records = records.filter((a) => a.status === status);
    }

    if (startDate) {
      records = records.filter((a) => a.date >= startDate);
    }

    if (endDate) {
      records = records.filter((a) => a.date <= endDate);
    }

    // Sort by date descending
    records.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Enrich with staff details
    const enrichedRecords = records.map((record) => {
      const staff = db.staff.find((s) => s.id === record.staffId);
      const department = staff
        ? db.departments.find((d) => d.id === staff.departmentId)
        : null;

      return {
        ...record,
        staff: staff
          ? {
              id: staff.id,
              name: staff.name,
              staffNo: staff.staffNo,
              email: staff.email,
              department: department
                ? { id: department.id, name: department.name }
                : null,
            }
          : null,
      };
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = enrichedRecords.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = enrichedRecords.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  });

  // 5. Get Staff Attendance History
  server.get(
    "/api/staff/:id/attendance",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;
      const { month, year, page = "1", limit = "20" } = req.query;

      let records = db.attendance.filter((a) => a.staffId === id);

      // Filter by month/year
      if (month && year) {
        records = records.filter((a) => {
          const date = new Date(a.date);
          return (
            date.getMonth() + 1 === parseInt(month as string) &&
            date.getFullYear() === parseInt(year as string)
          );
        });
      }

      // Sort by date descending
      records.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const total = records.length;
      const totalPages = Math.ceil(total / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedData = records.slice(startIndex, endIndex);

      res.json({
        data: paginatedData,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      });
    },
  );

  // 6. Get Current Week Attendance Chart Data
  server.get(
    "/api/charts/current-week-attendance",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();

      // Get current week dates (Monday to Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);

      const weekDates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date.toISOString().split("T")[0]);
      }

      // Get total active staff count
      const totalStaff = db.staff.filter((s) => s.status === "Employed").length;

      // Calculate attendance for each day
      const weekData = weekDates.map((date) => {
        const dayName = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const dayAttendance = db.attendance.filter((a) => a.date === date);

        const present = dayAttendance.filter(
          (a) => a.status === "PRESENT",
        ).length;
        const late = dayAttendance.filter((a) => a.status === "LATE").length;
        const absent = dayAttendance.filter(
          (a) => a.status === "ABSENT",
        ).length;
        const onLeave = dayAttendance.filter(
          (a) => a.status === "ON_LEAVE",
        ).length;
        const halfDay = dayAttendance.filter(
          (a) => a.status === "HALF_DAY",
        ).length;

        const attendanceRate =
          totalStaff > 0
            ? parseFloat(
                (((present + late + halfDay) / totalStaff) * 100).toFixed(1),
              )
            : 0;

        return {
          date,
          day: dayName,
          present,
          late,
          absent,
          onLeave,
          halfDay,
          total: totalStaff,
          attendanceRate,
        };
      });

      // Calculate week summary
      const weekSummary = {
        totalPresent: weekData.reduce((sum, d) => sum + d.present, 0),
        totalLate: weekData.reduce((sum, d) => sum + d.late, 0),
        totalAbsent: weekData.reduce((sum, d) => sum + d.absent, 0),
        totalOnLeave: weekData.reduce((sum, d) => sum + d.onLeave, 0),
        avgAttendanceRate: parseFloat(
          (
            weekData.reduce((sum, d) => sum + d.attendanceRate, 0) /
            weekData.length
          ).toFixed(1),
        ),
        weekStart: weekDates[0],
        weekEnd: weekDates[6],
      };

      res.json({
        weekData,
        summary: weekSummary,
      });
    },
  );

  // 7. Get Department Attendance Statistics
  server.get(
    "/api/attendance/department/:departmentId/stats",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { departmentId } = req.params;
      const { startDate, endDate } = req.query;

      // Get department staff
      const deptStaff = db.staff.filter((s) => s.departmentId === departmentId);
      const staffIds = deptStaff.map((s) => s.id);

      // Get attendance records
      let records = db.attendance.filter((a) => staffIds.includes(a.staffId));

      // Filter by date range
      if (startDate) {
        records = records.filter((a) => a.date >= startDate);
      }
      if (endDate) {
        records = records.filter((a) => a.date <= endDate);
      }

      // Calculate statistics
      const stats = {
        department: db.departments.find((d) => d.id === departmentId),
        totalStaff: deptStaff.length,
        totalRecords: records.length,
        present: records.filter((a) => a.status === "PRESENT").length,
        late: records.filter((a) => a.status === "LATE").length,
        absent: records.filter((a) => a.status === "ABSENT").length,
        onLeave: records.filter((a) => a.status === "ON_LEAVE").length,
        halfDay: records.filter((a) => a.status === "HALF_DAY").length,
        attendanceRate:
          records.length > 0
            ? parseFloat(
                (
                  (records.filter((a) =>
                    ["PRESENT", "LATE", "HALF_DAY"].includes(a.status),
                  ).length /
                    records.length) *
                  100
                ).toFixed(2),
              )
            : 0,
        avgWorkHours:
          records.length > 0
            ? parseFloat(
                (
                  records.reduce((sum, a) => sum + (a.workHours || 0), 0) /
                  records.length
                ).toFixed(2),
              )
            : 0,
      };

      res.json(stats);
    },
  );

  // 8. Get Today's Attendance Overview
  server.get(
    "/api/attendance/today",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const today = new Date().toISOString().split("T")[0];

      const todayRecords = db.attendance.filter((a) => a.date === today);
      const totalStaff = db.staff.filter((s) => s.status === "Employed").length;

      // Enrich with staff details
      const enrichedRecords = todayRecords.map((record) => {
        const staff = db.staff.find((s) => s.id === record.staffId);
        const department = staff
          ? db.departments.find((d) => d.id === staff.departmentId)
          : null;

        return {
          ...record,
          staff: staff
            ? {
                id: staff.id,
                name: staff.name,
                staffNo: staff.staffNo,
                email: staff.email,
                department: department
                  ? { id: department.id, name: department.name }
                  : null,
              }
            : null,
        };
      });

      const stats = {
        date: today,
        totalStaff,
        marked: todayRecords.length,
        unmarked: totalStaff - todayRecords.length,
        present: todayRecords.filter((a) => a.status === "PRESENT").length,
        late: todayRecords.filter((a) => a.status === "LATE").length,
        absent: todayRecords.filter((a) => a.status === "ABSENT").length,
        onLeave: todayRecords.filter((a) => a.status === "ON_LEAVE").length,
        halfDay: todayRecords.filter((a) => a.status === "HALF_DAY").length,
        attendanceRate:
          totalStaff > 0
            ? parseFloat(
                (
                  (todayRecords.filter((a) =>
                    ["PRESENT", "LATE", "HALF_DAY"].includes(a.status),
                  ).length /
                    totalStaff) *
                  100
                ).toFixed(2),
              )
            : 0,
      };

      res.json({
        stats,
        records: enrichedRecords,
      });
    },
  );

  // 9. Delete Attendance Record
  server.delete(
    "/api/attendance/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const index = db.attendance.findIndex((a) => a.id === id);

      if (index === -1) {
        res.status(404).json({ error: "Attendance record not found" });
        return;
      }

      const deleted = db.attendance.splice(index, 1)[0];
      saveDb(db);

      res.json({
        message: "Attendance record deleted successfully",
        deleted,
      });
    },
  );

  // 10. Get Attendance Report (Summary)
  server.get(
    "/api/attendance/report",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { startDate, endDate, departmentId } = req.query;

      let records = [...db.attendance];

      // Filter by date range
      if (startDate) {
        records = records.filter((a) => a.date >= startDate);
      }
      if (endDate) {
        records = records.filter((a) => a.date <= endDate);
      }

      // Filter by department
      if (departmentId) {
        const deptStaff = db.staff.filter(
          (s) => s.departmentId === departmentId,
        );
        const staffIds = deptStaff.map((s) => s.id);
        records = records.filter((a) => staffIds.includes(a.staffId));
      }

      // Group by staff
      const staffAttendance = new Map();

      records.forEach((record) => {
        if (!staffAttendance.has(record.staffId)) {
          const staff = db.staff.find((s) => s.id === record.staffId);
          const department = staff
            ? db.departments.find((d) => d.id === staff.departmentId)
            : null;

          staffAttendance.set(record.staffId, {
            staff: staff
              ? {
                  id: staff.id,
                  name: staff.name,
                  staffNo: staff.staffNo,
                  department: department
                    ? { id: department.id, name: department.name }
                    : null,
                }
              : null,
            totalDays: 0,
            present: 0,
            late: 0,
            absent: 0,
            onLeave: 0,
            halfDay: 0,
            totalWorkHours: 0,
          });
        }

        const staffData = staffAttendance.get(record.staffId);
        staffData.totalDays++;

        if (record.status === "PRESENT") staffData.present++;
        else if (record.status === "LATE") staffData.late++;
        else if (record.status === "ABSENT") staffData.absent++;
        else if (record.status === "ON_LEAVE") staffData.onLeave++;
        else if (record.status === "HALF_DAY") staffData.halfDay++;

        staffData.totalWorkHours += record.workHours || 0;
      });

      // Convert to array and calculate rates
      const report = Array.from(staffAttendance.values()).map((data) => ({
        ...data,
        attendanceRate:
          data.totalDays > 0
            ? parseFloat(
                (
                  ((data.present + data.late + data.halfDay) / data.totalDays) *
                  100
                ).toFixed(2),
              )
            : 0,
        avgWorkHours:
          data.totalDays > 0
            ? parseFloat((data.totalWorkHours / data.totalDays).toFixed(2))
            : 0,
      }));

      // Sort by attendance rate descending
      report.sort((a, b) => b.attendanceRate - a.attendanceRate);

      res.json({
        report,
        summary: {
          totalStaff: report.length,
          dateRange: { startDate, endDate },
          avgAttendanceRate:
            report.length > 0
              ? parseFloat(
                  (
                    report.reduce((sum, r) => sum + r.attendanceRate, 0) /
                    report.length
                  ).toFixed(2),
                )
              : 0,
        },
      });
    },
  );

  // 11. GEt Attendance Stats
  server.get(
    "/api/attendance/stats",
    (_req: TAuthRequest, res: Response): void => {
      const attendance = getDb().attendance;
      let stats: TAttendanceStats = {
        presentToday: 0,
        lateArrivals: 0,
        onLeave: 0,
        absent: 0,
      };

      stats = attendance.reduce((_acc, attend) => {
        return {
          presentToday:
            attend.status === "PRESENT"
              ? ++stats.presentToday
              : stats.presentToday,
          lateArrivals:
            attend.status === "LATE"
              ? ++stats.lateArrivals
              : stats.lateArrivals,
          onLeave:
            attend.status === "ON_LEAVE" ? ++stats.onLeave : stats.onLeave,
          absent: attend.status === "ABSENT" ? ++stats.absent : stats.absent,
        };
      }, stats);

      res.json(stats);
    },
  );
}
