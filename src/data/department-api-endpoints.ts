import type { Application, Response } from 'express'
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TDepartment, TDepartmentCreateRequest, TDepartmentSummary, TDepartmentUpdateRequest } from '@/types/departmentTypes';

export function hrmsDEPARTMENT_ENDPOINTS(server: Application, getDb: () => TDatabase, saveDb: (db: TDatabase) => void) {
    // Department filter

    server.get("/api/departments", (_req: TAuthRequest, res: Response): void => {
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
        (_req: TAuthRequest, res: Response): void => {
            const db = getDb();

            const summary: TDepartmentSummary[] = db.departments.map((dept) => {
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

    // Get All Departments
    server.get("/api/settings/departments", (req: TAuthRequest, res: Response): void => {
        const db = getDb();
        const { active, page = "1", limit = "10" } = req.query;

        console.log('LIMITED: ', limit)
        let departments = db.departments || [];

        if (active !== undefined) {
            const isActive = active === "true";
            departments = departments.filter((d) => d.isActive === isActive);
        }


        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const total = departments.length;
        const paginatedData = departments.slice(startIndex, endIndex);

        departments = paginatedData.reduce((deps: TDepartment[], dep) => {
            let _tmp = dep;
            _tmp.staffCount = db.staff.filter(s => s.departmentId === _tmp.id).length;
            deps.push(_tmp);
            return deps;
        }, []);

        res.json({
            data: departments,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                hasPrevPage: pageNum > 1,
                hasNextPage: endIndex < total,
                totalPages: Math.ceil(total / limitNum),
            }
        });
    });

    // Get Single Department
    server.get(
        "/api/settings/departments/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const department = db.departments?.find((d) => d.id === id);

            if (!department) {
                res.status(404).json({ error: "Department not found" });
                return;
            }

            res.json(department);
        }
    );

    // Create Department
    server.post(
        "/api/settings/departments",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const data = req.body as TDepartmentCreateRequest;

            // Validation
            if (!data.name || !data.code) {
                res.status(400).json({ error: "Name and code are required" });
                return;
            }

            // Check for duplicate code
            const exists = db.departments?.some(
                (d) => d.code.toLowerCase() === data.code.toLowerCase()
            );

            if (exists) {
                res.status(400).json({ error: "Department code already exists" });
                return;
            }

            const newDepartment: TDepartment = {
                id: `dept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: data.name,
                code: data.code,
                description: data.description,
                headOfDepartment: data.headOfDepartment,
                staffCount: 0,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (!db.departments) {
                db.departments = [];
            }

            db.departments.push(newDepartment);
            saveDb(db);

            res.status(201).json({
                success: true,
                message: "Department created successfully",
                department: newDepartment,
            });
        }
    );

    // Update Department
    server.patch(
        "/api/settings/departments/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;
            const updates = req.body as TDepartmentUpdateRequest;

            const department = db.departments?.find((d) => d.id === id);

            if (!department) {
                res.status(404).json({ error: "Department not found" });
                return;
            }

            // Check for duplicate code if updating
            if (updates.code) {
                const duplicate = db.departments?.some(
                    (d) =>
                        d.id !== id && d.code.toLowerCase() === updates.code!.toLowerCase()
                );

                if (duplicate) {
                    res.status(400).json({ error: "Department code already exists" });
                    return;
                }
            }

            Object.assign(department, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });

            saveDb(db);

            res.json({
                success: true,
                message: "Department updated successfully",
                department,
            });
        }
    );

    // Delete Department
    server.delete(
        "/api/settings/departments/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const index = db.departments?.findIndex((d) => d.id === id) ?? -1;

            if (index === -1) {
                res.status(404).json({ error: "Department not found" });
                return;
            }

            // Check if department has staff
            const hasStaff = db.staff?.some((s) => s.departmentId === id) ?? false;

            if (hasStaff) {
                res
                    .status(400)
                    .json({ error: "Cannot delete department with active staff members" });
                return;
            }

            const deleted = db.departments!.splice(index, 1)[0];
            saveDb(db);

            res.json({
                success: true,
                message: "Department deleted successfully",
                deleted,
            });
        }
    );
}
