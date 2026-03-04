import type { Application, Response } from 'express'
import type { TAuthRequest, TDatabase } from "@/types/types";
import type { TCreateAppointmentRequest, TNatureOfAppointment } from '@/types/appointmentTypes';

export function hrmsAPPOINTMENT_ENDPOINTS(server: Application, getDb: () => TDatabase, saveDb: (db: TDatabase) => void) {
    // Get All Appointments
    server.get(
        "/api/settings/appointments",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { active } = req.query;

            let appointments = db.natureOfAppointments || [];

            if (active !== undefined) {
                const isActive = active === "true";
                appointments = appointments.filter((a) => a.isActive === isActive);
            }

            res.json({
                data: appointments,
                total: appointments.length,
            });
        }
    );

    // Create Appointment
    server.post(
        "/api/settings/appointments",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const data = req.body as TCreateAppointmentRequest;

            if (!data.name) {
                res.status(400).json({ error: "Appointment name is required" });
                return;
            }

            const newAppointment: TNatureOfAppointment = {
                id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: data.name,
                description: data.description,
                duration: data.duration,
                benefits: data.benefits || [],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (!db.natureOfAppointments) {
                db.natureOfAppointments = [];
            }

            db.natureOfAppointments.push(newAppointment);
            saveDb(db);

            res.status(201).json({
                success: true,
                message: "Nature of appointment created successfully",
                appointment: newAppointment,
            });
        }
    );

    // Update Appointment
    server.patch(
        "/api/settings/appointments/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const appointment = db.natureOfAppointments?.find((a) => a.id === id);

            if (!appointment) {
                res.status(404).json({ error: "Appointment not found" });
                return;
            }

            Object.assign(appointment, {
                ...req.body,
                updatedAt: new Date().toISOString(),
            });

            saveDb(db);

            res.json({
                success: true,
                message: "Appointment updated successfully",
                appointment,
            });
        }
    );

    // Delete Appointment
    server.delete(
        "/api/settings/appointments/:id",
        (req: TAuthRequest, res: Response): void => {
            const db = getDb();
            const { id } = req.params;

            const index = db.natureOfAppointments?.findIndex((a) => a.id === id) ?? -1;

            if (index === -1) {
                res.status(404).json({ error: "Appointment not found" });
                return;
            }

            const deleted = db.natureOfAppointments!.splice(index, 1)[0];
            saveDb(db);

            res.json({
                success: true,
                message: "Appointment deleted successfully",
                deleted,
            });
        }
    );
}
