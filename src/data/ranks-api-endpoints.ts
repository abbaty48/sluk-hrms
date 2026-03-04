import type { Application, Response } from 'express'
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TCreateRankRequest, TRank } from '@/types/rankTypes';


export function hrmsRANK_ENDPOINTS(server: Application, getDb: () => TDatabase, saveDb: (db: TDatabase) => void) {

    // Get all ranks with optional filtering
    server.get("/api/ranks", (req: TAuthRequest, res: Response): void => {
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
                    r.name.toLowerCase().includes(searchTerm) ||
                    (r.description && r.description.toLowerCase().includes(searchTerm)),
            );
        }

        // Sort by level (ascending)
        ranks = ranks.sort((a, b) => a.level - b.level);

        res.json({
            data: ranks,
        });
    });

    // Get All Ranks
    server.get("/api/settings/ranks", (req: TAuthRequest, res: Response): void => {
        const db = getDb();
        const { active, category } = req.query;

        let ranks = db.ranks || [];

        if (active !== undefined) {
            const isActive = active === "true";
            ranks = ranks.filter((r) => r.isActive === isActive);
        }

        if (category) {
            ranks = ranks.filter((r) => r.category === category);
        }

        // Sort by level
        ranks.sort((a, b) => b.level - a.level);

        res.json({
            data: ranks,
            total: ranks.length,
        });
    });

    // Create Rank
    server.post("/api/settings/ranks", (req: TAuthRequest, res: Response): void => {
        const db = getDb();
        const data = req.body as TCreateRankRequest;

        if (!data.name || !data.level || !data.category) {
            res
                .status(400)
                .json({ error: "Name, level, and category are required" });
            return;
        }

        const newRank: TRank = {
            id: `rank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: data.name,
            level: data.level,
            category: data.category,
            salaryGrade: data.salaryGrade,
            requirements: data.requirements,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (!db.ranks) {
            db.ranks = [];
        }

        db.ranks.push(newRank);
        saveDb(db);

        res.status(201).json({
            success: true,
            message: "Rank created successfully",
            rank: newRank,
        });
    });

    // Update Rank
    server.patch(
        "/api/settings/ranks/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const rank = db.ranks?.find((r) => r.id === id);

            if (!rank) {
                res.status(404).json({ error: "Rank not found" });
                return;
            }

            Object.assign(rank, {
                ...req.body,
                updatedAt: new Date().toISOString(),
            });

            saveDb(db);

            res.json({
                success: true,
                message: "Rank updated successfully",
                rank,
            });
        }
    );

    // Delete Rank
    server.delete(
        "/api/settings/ranks/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const index = db.ranks?.findIndex((r) => r.id === id) ?? -1;

            if (index === -1) {
                res.status(404).json({ error: "Rank not found" });
                return;
            }

            const deleted = db.ranks!.splice(index, 1)[0];
            saveDb(db);

            res.json({
                success: true,
                message: "Rank deleted successfully",
                deleted,
            });
        }
    );
}
