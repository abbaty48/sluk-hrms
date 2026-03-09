import type { Application, Response } from "express"
import type { TAuthRequest, TDatabase } from "../types/types"
import type { TDocument } from "../types/types"
import fs from "fs"
import path from "path"

export function hrmsDOCUMENT_ENDPOINTS(
    server: Application,
    getDb: () => TDatabase,
    saveDb: (db: TDatabase) => void
) {
    // ── HELPERS ────────────────────────────────────────────────────────
    function formatFileSize(bytes: number): string {
        if (!bytes) return "0 KB"
        if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
        return `${Math.round(bytes / 1000)} KB`
    }

    function getFileType(mimeType: string): string {
        const map: Record<string, string> = {
            "application/pdf": "PDF",
            "image/jpeg": "JPG",
            "image/png": "PNG",
        }
        return map[mimeType] ?? "FILE"
    }

    // ── GET ALL DOCUMENTS (Admin view) ────────────────────────────────
    server.get("/api/documents", (req: TAuthRequest, res: Response) => {
        const db = getDb()
        const {
            category,
            status,
            page = "1",
            limit = "10", // FIX 1 — removed the space in ' 10'
        } = req.query

        let docs = [...db.documents]

        if (category) {
            docs = docs.filter((d) => d.category === category)
        }
        if (status === "Verified") {
            docs = docs.filter((d) => d.isVerified === true)
        } else if (status === "Pending") {
            docs = docs.filter((d) => d.isVerified === false)
        }

        docs.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const start = (pageNum - 1) * limitNum
        const paginated = docs.slice(start, start + limitNum)

        const formatted = paginated.map((d) => {
            const staff = db.staff.find((s) => s.id === d.staffId)
            return {
                id: d.id,
                staffId: d.staffId,
                staffName: staff?.name ?? "Unknown",
                title: d.title,
                category: d.category,
                fileType: getFileType(d.mimeType),
                fileSize: formatFileSize(d.fileSize),
                status: d.isVerified ? "Verified" : "Pending",
                uploadedAt: d.createdAt,
                description: d.description,
            }
        })

        res.json({
            documents: formatted,
            total: docs.length,
            page: pageNum,
            limit: limitNum,
        })
    })

    // ── GET SINGLE STAFF DOCUMENTS ────────────────────────────────────
    // FIX 2 — changed from GET /api/documents/:id to GET /api/staff/:id/documents
    //          to avoid route conflict with /api/documents/:id/view and /download
    server.get("/api/staff/:id/documents", (req: TAuthRequest, res: Response) => {
        const db = getDb()
        const staffId = req.params.id

        const staff = db.staff.find((s) => s.id === staffId)
        if (!staff)
            // FIX 3 — was res.sendStatus(404).json(...) which throws an error
            //          sendStatus() sends immediately and can't be chained with .json()
            return res.status(404).json({ message: "Staff not found" })

        const { category, status } = req.query
        let docs = db.documents.filter((d) => d.staffId === staffId)

        // FIX 4 — was: if(category) return res.json(...) which returned immediately
        //          and skipped the status filter entirely. Now both filters run first
        if (category) {
            docs = docs.filter((d) => d.category === category)
        }
        if (status === "Verified") {
            docs = docs.filter((d) => d.isVerified === true)
        } else if (status === "Pending") {
            docs = docs.filter((d) => d.isVerified === false)
        }

        docs.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        const formatted = docs.map((d) => ({
            id: d.id,
            staffId: d.staffId,
            staffName: staff?.name ?? "Unknown",
            title: d.title,
            category: d.category,
            fileType: getFileType(d.mimeType),
            fileSize: formatFileSize(d.fileSize),
            status: d.isVerified ? "Verified" : "Pending",
            uploadedAt: d.createdAt,
            description: d.description,
            degree: d.degree ?? null,
            institution: d.institution ?? null,
            year: d.year ?? null,
        }))

        const categoryCounts = formatted.reduce(
            (acc, doc) => {
                acc[doc.category] = (acc[doc.category] || 0) + 1
                return acc
            },
            {} as Record<string, number>
        )

        const summary =
            formatted.length > 0
                ? {
                    totalDocuments: formatted.length,
                    verifiedDocuments: formatted.filter((d) => d.status === "Verified").length,
                    pendingDocuments: formatted.filter((d) => d.status === "Pending").length,
                    categoryDistribution: categoryCounts,
                }
                : null

        res.json({ summary, data: formatted })
    })

    // ── ADD DOCUMENT ──────────────────────────────────────────────────
    server.post("/api/staff/:id/documents", (req: TAuthRequest, res: Response) => {
        const db = getDb()
        const staffId = req.params.id

        const staff = db.staff.find((s) => s.id === staffId)
        if (!staff)
            return res.status(404).json({ message: "Staff not found" })

        const {
            title,
            category,
            fileName, // FIX 5 — was 'filename' (lowercase n) but used as 'fileName' below causing ReferenceError
            fileSize,
            mimeType,
            description,
            degree,
            institution,
            year,
        } = req.body

        if (!title || !category || !fileName || !mimeType) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["title", "category", "fileName", "mimeType"],
            })
        }

        const VALID_CATEGORIES = [
            "Certificates",
            "Appointment Letters",
            "ID & Photos", // FIX 6 — was 'UD & Photos' (typo)
            "Other Documents",
        ]

        if (!VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: "Invalid category",
                validCategories: VALID_CATEGORIES,
            })
        }

        const lastDoc = db.documents[db.documents.length - 1]
        const lastNum = lastDoc ? parseInt(lastDoc.id.replace("doc_", "")) : 0
        const newId = `doc_${lastNum + 1}`
        const newDoc: TDocument = {
            id: newId,
            staffId: Array.isArray(staffId) ? staffId[0] : staffId,
            title: Array.isArray(title) ? title[0] : title,
            category: Array.isArray(category) ? category[0] : category,
            fileName: Array.isArray(fileName) ? fileName[0] : fileName,
            fileSize: fileSize ?? 0,
            mimeType: Array.isArray(mimeType) ? mimeType[0] : mimeType,
            uploadedBy: Array.isArray(staffId) ? staffId[0] : staffId,
            isVerified: false,
            verifiedBy: null,
            description: Array.isArray(description) ? description[0] : (description ?? null),
            degree: Array.isArray(degree) ? degree[0] : (degree ?? null),
            institution: Array.isArray(institution) ? institution[0] : (institution ?? null),
            year: Array.isArray(year) ? year[0] : (year ?? null),
            // ...existing code...
        };

        db.documents.push(newDoc)
        saveDb(db)

        res.status(201).json({
            message: "Document uploaded successfully",
            document: {
                ...newDoc,
                fileType: getFileType(newDoc.mimeType), // FIX 7 — was 'getFileType:' (looked like a function key)
                fileSize: formatFileSize(newDoc.fileSize), // FIX 8 — was 'getFileSize:' (wrong key name)
                status: newDoc.isVerified ? "Verified" : "Pending",
                uploadedAt: newDoc.createdAt,
            },
        })
    })

    // ── VIEW DOCUMENT ─────────────────────────────────────────────────
    server.get("/api/documents/:id/view", (req: TAuthRequest, res: Response) => {
        const db = getDb()
        const docId = req.params.id

        const doc = db.documents.find((d) => d.id === docId)
        if (!doc)
            return res.status(404).json({ message: "Document not found" })

        const staff = db.staff.find((s) => s.id === doc.staffId)
        if (!staff)
            return res.status(404).json({ message: "Staff not found" })

        const filePath = path.join(__dirname, "uploads", doc.fileName)

        if (!fs.existsSync(filePath)) {
            // FIX 9 — was res.status(201) which means "Created" — wrong for a GET
            //          200 is the correct status for a successful data response
            return res.status(200).json({
                id: doc.id,
                staffId: doc.staffId,
                staffName: staff?.name ?? "Unknown",
                title: doc.title,
                category: doc.category,
                fileType: getFileType(doc.mimeType),
                fileSize: formatFileSize(doc.fileSize),
                mimeType: doc.mimeType,
                status: doc.isVerified ? "Verified" : "Pending",
                uploadedAt: doc.createdAt,
                description: doc.description,
                degree: doc.degree ?? null,
                institution: doc.institution ?? null,
                year: doc.year ?? null,
            })
        }

        // file exists on disk — stream it inline to the browser
        res.setHeader("Content-Type", doc.mimeType)
        res.setHeader("Content-Disposition", `inline; filename="${doc.fileName}"`)
        fs.createReadStream(filePath).pipe(res)
    })

    // ── DOWNLOAD DOCUMENT ─────────────────────────────────────────────
    server.get("/api/documents/:id/download", (req: TAuthRequest, res: Response): void => {
        const db = getDb()
        const doc = db.documents.find((d) => d.id === req.params.id)

        if (!doc) {
            res.status(404).json({ message: "Document not found" })
            return
        }

        const filePath = path.join(__dirname, "uploads", doc.fileName)

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: "File not found on server" })
            return
        }

        res.setHeader("Content-Type", doc.mimeType)
        res.setHeader("Content-Disposition", `attachment; filename="${doc.fileName}"`)
        res.setHeader("Content-Length", doc.fileSize)
        fs.createReadStream(filePath).pipe(res)
    })

    // ── VERIFY DOCUMENT ───────────────────────────────────────────────
    server.patch("/api/documents/:id/verify", (req: TAuthRequest, res: Response): void => {
        const db = getDb()
        const doc = db.documents.find((d) => d.id === req.params.id)

        if (!doc) {
            res.status(404).json({ message: "Document not found" })
            return
        }

        doc.isVerified = true
        doc.verifiedBy = req.body.verifiedBy ?? "staff_3"
        doc.updatedAt = new Date().toISOString()

        saveDb(db)

        res.json({ message: "Document verified", document: doc })
    })
}