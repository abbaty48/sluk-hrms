import { useState } from "react"
import { Eye, Download, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStaffDocument, useDocumentView, downloadDocument } from "@/hooks/api/useDocumentEmployee"
import { QueryErrorBoundary } from "@/components/ErrorBoundary"
import { Suspense } from "react"

// ── HELPER ────────────────────────────────────────────────────────
function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "Unknown"
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString()
}

// ── SHIMMER ───────────────────────────────────────────────────────
function TableShimmer() {
  return (
    <div className="border rounded-xl overflow-hidden mx-2">
      <div className="p-4 border-b">
        <div className="shimmer h-5 w-32 rounded-md" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <div className="space-y-1 flex-1">
              <div className="shimmer h-4 w-40 rounded-md" />
              <div className="shimmer h-3 w-24 rounded-md" />
            </div>
            <div className="shimmer h-4 w-28 rounded-md" />
            <div className="shimmer h-4 w-16 rounded-md" />
            <div className="shimmer h-6 w-20 rounded-full" />
            <div className="shimmer h-4 w-12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TABLE ─────────────────────────────────────────────────────────
function DocumentsTable() {
  const data      = useStaffDocument("staff_2")
  const documents = data?.data ?? []

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [viewOpen, setViewOpen]           = useState(false)

  const { data: docDetail } = useDocumentView(selectedDocId)

  const handleView = (docId: string) => {
    setSelectedDocId(docId)
    setViewOpen(true)
  }

  const handleClose = () => {
    setViewOpen(false)
    setSelectedDocId(null)
  }

  return (
    <>
      <div className="border rounded-xl overflow-hidden mx-2">
        <div className="p-4 border-b">
          <h3 className="font-semibold">All Documents</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b text-sm text-muted-foreground">
              <th className="text-left p-3">DOCUMENT</th>
              <th className="text-left p-3">CATEGORY</th>
              <th className="text-left p-3">SIZE</th>
              <th className="text-left p-3">STATUS</th>
              <th className="text-right p-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground py-10"
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-muted/30 transition">

                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{doc.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {doc.fileType} · Uploaded {formatDate(doc.uploadedAt)}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-sm">{doc.category}</td>
                  <td className="p-3 text-sm">{doc.fileSize}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === "Verified"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => handleView(doc.id)}>
                        <Eye
                          size={16}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </button>
                      <button onClick={() => downloadDocument(doc.id)}>
                        <Download
                          size={16}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <Card className="relative w-full max-w-md shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">

            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <X className="w-4 h-4" />
            </Button>

            <CardHeader className="border-b shrink-0">
              {docDetail ? (
                <>
                  <CardTitle className="text-base">{docDetail.title}</CardTitle>
                  {docDetail.staffName && (
                    <p className="text-xs text-muted-foreground">{docDetail.staffName}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="shimmer h-5 w-40 rounded-md" />
                  <div className="shimmer h-3 w-24 rounded-md mt-1" />
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-3 pt-4 overflow-y-auto">
              {!docDetail ? (
                // loading state while fetching doc detail
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="shimmer h-3 w-20 rounded-md" />
                    <div className="shimmer h-3 w-28 rounded-md" />
                  </div>
                ))
              ) : (
                <>
                  {[
                    { label: "Category",    value: docDetail.category },
                    { label: "File Type",   value: docDetail.fileType },
                    { label: "File Size",   value: docDetail.fileSize },
                    { label: "Uploaded",    value: formatDate(docDetail.uploadedAt) },
                    { label: "Description", value: docDetail.description },
                    { label: "Degree",      value: docDetail.degree },
                    { label: "Institution", value: docDetail.institution },
                    { label: "Year",        value: docDetail.year },
                  ]
                    .filter(row => !!row.value)
                    .map(row => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="text-right max-w-[60%]">{row.value}</span>
                      </div>
                    ))}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      docDetail.status === "Verified"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {docDetail.status}
                    </span>
                  </div>
                </>
              )}
            </CardContent>

          </Card>
        </div>
      )}
    </>
  )
}

// ── EXPORT ────────────────────────────────────────────────────────
export function EmployeeDocumentsTable() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<TableShimmer />}>
        <DocumentsTable />
      </Suspense>
    </QueryErrorBoundary>
  )
}