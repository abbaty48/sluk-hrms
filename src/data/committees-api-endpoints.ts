import type { Application, Response } from "express";
import type { TCommittee } from "@/types/committeeTypes";
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TCreateCommitteeRequest } from "@/types/committeeTypes";

export function hrmsCOMMITTEES_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void,
) {
  // Get All Committees
  server.get(
    "/api/settings/committees",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { active } = req.query;

      let committees = db.committees || [];

      if (active !== undefined) {
        const isActive = active === "true";
        committees = committees.filter((c) => c.isActive === isActive);
      }

      res.json({
        data: committees,
        total: committees.length,
      });
    },
  );

  // Create Committee
  server.post(
    "/api/settings/committees",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const data = req.body as TCreateCommitteeRequest;

      if (!data.name) {
        res.status(400).json({ error: "Committee name is required" });
        return;
      }

      const newCommittee: TCommittee = {
        id: `comm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        name: data.name,
        description: data.description,
        chairman: data.chairman,
        members: data.members || [],
        purpose: data.purpose,
        meetingSchedule: data.meetingSchedule,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!db.committees) {
        db.committees = [];
      }

      db.committees.push(newCommittee);
      saveDb(db);

      res.status(201).json({
        success: true,
        message: "Committee created successfully",
        committee: newCommittee,
      });
    },
  );

  // Update Committee
  server.patch(
    "/api/settings/committees/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const committee = db.committees?.find((c) => c.id === id);

      if (!committee) {
        res.status(404).json({ error: "Committee not found" });
        return;
      }

      Object.assign(committee, {
        ...req.body,
        updatedAt: new Date().toISOString(),
      });

      saveDb(db);

      res.json({
        success: true,
        message: "Committee updated successfully",
        committee,
      });
    },
  );

  // Delete Committee
  server.delete(
    "/api/settings/committees/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const index = db.committees?.findIndex((c) => c.id === id) ?? -1;

      if (index === -1) {
        res.status(404).json({ error: "Committee not found" });
        return;
      }

      const deleted = db.committees!.splice(index, 1)[0];
      saveDb(db);

      res.json({
        success: true,
        message: "Committee deleted successfully",
        deleted,
      });
    },
  );
}
