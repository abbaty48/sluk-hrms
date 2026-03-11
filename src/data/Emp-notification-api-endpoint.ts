import type { Application, Response } from "express"
import type { TAuthRequest, TDatabase } from "../types/types"

export function hrmsEMPLOYEE_NOTIFICATION_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
  saveDb: (db: TDatabase) => void
) {

  // ── GET NOTIFICATIONS ─────────────────────────────────────────────
  server.get("/api/staff/:id/notifications", (req: TAuthRequest, res: Response) => {
    const db = getDb()
    const staffId = req.params.id
    const {
      read,
      type,
      endDate,
      priority,
      startDate,
      page = "1",
      limit = "20",
    } = req.query;

    console.log('STAFF NOTIFICATION: ')

    const staff = db.staff.find((s) => s.id === staffId)
    if (!staff) return res.status(404).json({ message: "Staff not found" })

    let notifs = db.notifications.filter((n) => n.userId === staffId)

    // filters
    if (read === "true") notifs = notifs.filter((n) => n.read === true)
    if (read === "false") notifs = notifs.filter((n) => n.read === false)
    if (type) notifs = notifs.filter((n) => n.type === type)
    if (priority) notifs = notifs.filter((n) => n.priority === priority)
    if (startDate) notifs = notifs.filter((n) => new Date(n.createdAt) >= new Date(startDate as string))
    if (endDate) notifs = notifs.filter((n) => new Date(n.createdAt) <= new Date(endDate as string))

    // newest first
    notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const start = (pageNum - 1) * limitNum
    const paginated = notifs.slice(start, start + limitNum)
    const total = notifs.length
    const totalPages = Math.ceil(total / limitNum)

    const allStaffNotifs = db.notifications.filter((n) => n.userId === staffId)
    const unreadCount = allStaffNotifs.filter((n) => !n.read).length

    res.json({
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        unreadCount,
      },
    })
  })

  // ── GET NOTIFICATION STATS ────────────────────────────────────────
  server.get("/api/staff/:id/notifications/stats", (req: TAuthRequest, res: Response) => {
    const db = getDb()
    const staffId = req.params.id

    const notifs = db.notifications.filter((n) => n.userId === staffId)

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const byType = notifs.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    res.json({
      total: notifs.length,
      unread: notifs.filter((n) => !n.read).length,
      read: notifs.filter((n) => n.read).length,
      todayCount: notifs.filter((n) => new Date(n.createdAt) >= today).length,
      weekCount: notifs.filter((n) => new Date(n.createdAt) >= week).length,
      byType,
    })
  })

  // ── MARK SPECIFIC NOTIFICATIONS AS READ ───────────────────────────
  server.patch("/api/notifications/read", (req: TAuthRequest, res: Response) => {
    const db = getDb()
    const { notificationIds }: { notificationIds: string[] } = req.body

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: "notificationIds array is required" })
    }

    const now = new Date().toISOString()
    const marked = db.notifications.filter((n) => notificationIds.includes(n.id))

    marked.forEach((n) => {
      n.read = true
      n.readAt = now
    })

    saveDb(db)

    res.json({
      success: true,
      count: marked.length,
      notifications: marked,
    })
  })

  // ── MARK ALL AS READ ──────────────────────────────────────────────
  server.patch("/api/staff/:id/notifications/read-all", (req: TAuthRequest, res: Response) => {
    const db = getDb()
    const staffId = req.params.id
    const now = new Date().toISOString()

    const notifs = db.notifications.filter((n) => n.userId === staffId && !n.read)
    notifs.forEach((n) => {
      n.read = true
      n.readAt = now
    })

    saveDb(db)

    res.json({
      success: true,
      count: notifs.length,
      message: `${notifs.length} notifications marked as read`,
    })
  })

  // ── DELETE A NOTIFICATION ─────────────────────────────────────────
  server.delete("/api/notifications/:id", (req: TAuthRequest, res: Response) => {
    const db = getDb()
    const idx = db.notifications.findIndex((n) => n.id === req.params.id)

    if (idx === -1) return res.status(404).json({ message: "Notification not found" })

    db.notifications.splice(idx, 1)
    saveDb(db)

    res.json({ success: true, message: "Notification deleted" })
  })
}
