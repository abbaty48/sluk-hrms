import type { Application, Response } from 'express'
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TUpdatePreferencesRequest } from '@/types/settingsTypes';

export function hrmsSETTINGS_ENDPOINTS(server: Application, getDb: () => TDatabase, saveDb: (db: TDatabase) => void) {

  // Get System Preferences
  server.get("/api/settings/preferences", (_req: TAuthRequest, res: Response): void => {
    const db = getDb();

    // Get or create default preferences
    let preferences = db.systemPreferences;

    if (!preferences) {
      preferences = {
        id: "sys_pref_1",
        institutionName: "Sule Lamido University",
        institutionAbbreviation: "SLU",
        dateFormat: "DD/MM/YYYY",
        fiscalYearStart: "January",
        leaveApprovalLevels: 2,
        emailNotifications: true,
        smsNotifications: false,
        theme: "system",
        language: "en",
        timezone: "Africa/Lagos",
        updatedAt: new Date().toISOString(),
      };
      db.systemPreferences = preferences;
      saveDb(db);
    }

    res.json(preferences);
  });

  // Update System Preferences
  server.patch(
    "/api/settings/preferences",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const updates = req.body as TUpdatePreferencesRequest;

      if (!db.systemPreferences) {
        res.status(404).json({ error: "Preferences not found" });
        return;
      }

      // Update preferences
      Object.assign(db.systemPreferences, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user?.staffId,
      });

      saveDb(db);

      res.json({
        success: true,
        message: "Preferences updated successfully",
        preferences: db.systemPreferences,
      });
    }
  );

}
