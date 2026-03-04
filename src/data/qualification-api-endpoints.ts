import type { Application, Response } from "express";
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TLeaveUtilization } from "@/types/leave-managementTypes";

export function hrmsQUALIFICATION_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {
  // GET /api/qualifications?staffId=&level=&year=&page=&limit=
  server.get(
    "/api/qualifications",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { staffId, level, year, page = "1", limit = "20" } = req.query;

      let qualifications = db.qualifications || [];

      if (staffId) {
        qualifications = qualifications.filter(
          (q) => q.staffId === (staffId as string),
        );
      }

      if (level) {
        qualifications = qualifications.filter(
          (q) => q.level?.toLowerCase() === (level as string).toLowerCase(),
        );
      }

      if (year) {
        qualifications = qualifications.filter(
          (q) => q.year === (year as string),
        );
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const total = qualifications.length;
      const paginated = qualifications.slice(startIndex, endIndex);

      res.json({
        data: paginated,
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

  // GET /api/qualifications/:id
  server.get(
    "/api/qualifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const qualification = (db.qualifications || []).find(
        (q) => q.id === req.params.id,
      );

      if (!qualification) {
        res.status(404).json({ error: "Qualification not found" });
        return;
      }

      res.json(qualification);
    },
  );

  // POST /api/staff/:id/qualifications
  server.post(
    "/api/staff/:id/qualifications",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const staffId = req.params.id;

      const staff = db.staff.find((s) => s.id === staffId);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }

      const { degree, institution, year, level, isHighest } = req.body;

      if (!degree || !institution || !year || !level) {
        res
          .status(400)
          .json({ error: "degree, institution, year, and level are required" });
        return;
      }

      if (isHighest) {
        (db.qualifications || []).forEach((q) => {
          if (q.staffId === staffId) q.isHighest = false;
        });
      }

      const existing = db.qualifications;
      const newQual = {
        id: `qual_${Date.now()}`,
        staffId,
        degree,
        institution,
        year,
        level,
        isHighest: isHighest === true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // const summary: TAttendanceSummary = {
      //   totalDays: attendanceRecords.length,
      //   present: attendanceRecords.filter((a) => a.status === "PRESENT").length,
      //   absent: attendanceRecords.filter((a) => a.status === "ABSENT").length,
      //   late: attendanceRecords.filter((a) => a.status === "LATE").length,
      //   onLeave: attendanceRecords.filter((a) => a.status === "ON_LEAVE").length,
      //   avgWorkHours:
      //     attendanceRecords.length > 0
      //       ? (
      //         attendanceRecords.reduce(
      //           (sum, a) => sum + (a.workHours || 0),
      //           0,
      //         ) / attendanceRecords.length
      //       ).toFixed(2)
      //       : "0",
      // };

      // existing.push(newQual);
      db.qualifications = existing;
      saveDb(db);

      res.status(201).json(newQual);
    },
  );

  // PUT /api/qualifications/:id
  server.put(
    "/api/qualifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const qualifications = db.qualifications || [];
      const index = qualifications.findIndex((q) => q.id === req.params.id);

      if (index === -1) {
        res.status(404).json({ error: "Qualification not found" });
        return;
      }

      const existing = qualifications[index];
      const { degree, institution, year, level, isHighest } = req.body;

      if (isHighest === true) {
        qualifications.forEach((q) => {
          if (q.staffId === existing.staffId) q.isHighest = false;
        });
      }

      const updated = {
        ...existing,
        degree: degree ?? existing.degree,
        institution: institution ?? existing.institution,
        year: year ?? existing.year,
        level: level ?? existing.level,
        isHighest: isHighest !== undefined ? isHighest : existing.isHighest,
        updatedAt: new Date().toISOString(),
      };

      qualifications[index] = updated;
      db.qualifications = qualifications;
      saveDb(db);

      res.json(updated);
    },
  );

  // PATCH /api/qualifications/:id
  server.patch(
    "/api/qualifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const qualifications = db.qualifications || [];
      const index = qualifications.findIndex((q) => q.id === req.params.id);

      if (index === -1) {
        res.status(404).json({ error: "Qualification not found" });
        return;
      }

      const existing = qualifications[index];

      if (req.body.isHighest === true) {
        qualifications.forEach((q) => {
          if (q.staffId === existing.staffId) q.isHighest = false;
        });
      }

      const updated = {
        ...existing,
        ...req.body,
        id: existing.id,
        staffId: existing.staffId,
        updatedAt: new Date().toISOString(),
      };

      qualifications[index] = updated;
      db.qualifications = qualifications;
      saveDb(db);

      res.json(updated);
    },
  );

  // DELETE /api/qualifications/:id
  server.delete(
    "/api/qualifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const qualifications = db.qualifications || [];
      const index = qualifications.findIndex((q) => q.id === req.params.id);

      if (index === -1) {
        res.status(404).json({ error: "Qualification not found" });
        return;
      }

      const deleted = qualifications.splice(index, 1)[0];
      db.qualifications = qualifications;
      saveDb(db);

      res.json({
        message: "Qualification deleted successfully",
        id: deleted.id,
      });
    },
  );

  // GET /api/qualifications/stats/by-level
  server.get(
    "/api/qualifications/stats/by-level",
    (_req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const qualifications = db.qualifications || [];

      const levelCounts = new Map<string, number>();
      qualifications.forEach((q) => {
        if (q.isHighest) {
          levelCounts.set(q.level, (levelCounts.get(q.level) || 0) + 1);
        }
      });

      const result = Array.from(levelCounts.entries())
        .map(([level, count]) => ({ level, count }))
        .sort((a, b) => b.count - a.count);

      res.json(result);
    },
  );

  // Leave utilization by department
  server.get(
    "/api/charts/leave-utilization",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { year } = req.query;
      const targetYear = year
        ? parseInt(year as string)
        : new Date().getFullYear();

      const utilization: TLeaveUtilization[] = db.departments
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
}
