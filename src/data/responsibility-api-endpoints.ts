import type { Application, Response } from 'express'
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TCreateResponsibilityRequest, TResponsibility } from '@/types/responsibilityTypes';

export function hrmsRESPONSIBILITY_ENDPOINTS(server: Application, getDb: () => TDatabase, saveDb: (db: TDatabase) => void) {
    // Get All Responsibilities
    server.get(
        "/api/settings/responsibilities",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { active, department } = req.query;

            let responsibilities = db.responsibilities || [];

            if (active !== undefined) {
                const isActive = active === "true";
                responsibilities = responsibilities.filter((r) => r.isActive === isActive);
            }

            if (department) {
                responsibilities = responsibilities.filter(
                    (r) => r.department === department
                );
            }

            res.json({
                data: responsibilities,
                total: responsibilities.length,
            });
        }
    );

    // Create Responsibility
    server.post(
        "/api/settings/responsibilities",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const data = req.body as TCreateResponsibilityRequest;

            if (!data.title || !data.description) {
                res
                    .status(400)
                    .json({ error: "Title and description are required" });
                return;
            }

            const newResponsibility: TResponsibility = {
                id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: data.title,
                description: data.description,
                department: data.department,
                assignedTo: data.assignedTo || [],
                priority: data.priority || "medium",
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (!db.responsibilities) {
                db.responsibilities = [];
            }

            db.responsibilities.push(newResponsibility);
            saveDb(db);

            res.status(201).json({
                success: true,
                message: "Responsibility created successfully",
                responsibility: newResponsibility,
            });
        }
    );

    // Update Responsibility
    server.patch(
        "/api/settings/responsibilities/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const responsibility = db.responsibilities?.find((r) => r.id === id);

            if (!responsibility) {
                res.status(404).json({ error: "Responsibility not found" });
                return;
            }

            Object.assign(responsibility, {
                ...req.body,
                updatedAt: new Date().toISOString(),
            });

            saveDb(db);

            res.json({
                success: true,
                message: "Responsibility updated successfully",
                responsibility,
            });
        }
    );

    // Delete Responsibility
    server.delete(
        "/api/settings/responsibilities/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const index = db.responsibilities?.findIndex((r) => r.id === id) ?? -1;

            if (index === -1) {
                res.status(404).json({ error: "Responsibility not found" });
                return;
            }

            const deleted = db.responsibilities!.splice(index, 1)[0];
            saveDb(db);

            res.json({
                success: true,
                message: "Responsibility deleted successfully",
                deleted,
            });
        }
    );

}
