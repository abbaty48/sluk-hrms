import {
  downloadDocument,
  useEmployeeDocument,
} from "@sluk/src/hooks/api/useEmployeeDocumentAPI";
import { useState, Suspense } from "react";
import { Eye, Download, Box, CrossIcon, X } from "lucide-react";
import { Paginator } from "@sluk/src/components/Paginator";
import { EmptyState } from "@sluk/src/components/EmptyState";
import type { TDocument } from "@sluk/src/types/documentTypes";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { EmployeeDocumentDetails } from "./EmployeeDocumentDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sluk/src/components/ui/select";
import { Button } from "@sluk/src/components/ui/button";

// ── HELPER ────────────────────────────────────────────────────────

function getFileType(mimeType: string) {
  switch (mimeType) {
    case "application/pdf":
      return "Pdf";
    case "image/jpeg":
      return "Jpeg";
    case "image/png":
      return "Png";
    case "image/gif":
      return "Gif";
    case "image/webp":
      return "Webp";
    case "application/msword":
      return "Ms word";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
      return "Ms Excel";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "Ms docx";
    default:
      return "Others";
  }
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
  );
}

// ── TABLE ─────────────────────────────────────────────────────────

function DocumentsTable() {
  type TFilter = {
    page: number;
    limit: string;
    status: string | null;
    category: string | null;
  };

  const [viewOpen, setViewOpen] = useState(false);
  const [docDetail, setDocDetail] = useState<TDocument | null>(null);
  const [filters, setFilters] = useState<TFilter>({
    page: 1,
    limit: "5",
    status: null,
    category: null,
  });

  const changeFilter = (filter: Partial<TFilter>) => {
    setFilters((prevState) => ({ ...prevState, ...filter }));
  };

  const {
    data: documents,
    pagination,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
  } = useEmployeeDocument({ ...filters });

  const handleView = (docId: string) => {
    const doc = documents.find((doc) => doc.id === docId);
    if (doc) {
      setDocDetail(doc);
      setViewOpen(true);
    }
  };

  const handleClose = () => {
    setViewOpen(false);
    setDocDetail(null);
  };

  return (
    <>
      <Card className="border rounded-xl overflow-hidden">
        <CardHeader className="flex flex-wrap gap-2 justify-between items-center">
          <CardTitle className="font-semibold">All Documents</CardTitle>
          <div className="flex flex-wrap gap-2">
            {/*Filter By Category*/}
            <Select
              defaultValue={undefined}
              onValueChange={(val) => changeFilter({ category: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Filter By Category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Certificates">Certificates</SelectItem>
                <SelectItem value="ID&Photos">ID & Photos</SelectItem>
                <SelectItem value="AppointmentLetters">
                  Appointment Letters
                </SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>

            {/*Filter By Status*/}

            <Select
              defaultValue={undefined}
              onValueChange={(val) => changeFilter({ status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Filter By Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear filter */}
            {(filters.status || filters.category) && (
              <Button
                variant={"ghost"}
                onClick={() =>
                  changeFilter({
                    status: null,
                    category: null,
                    limit: "5",
                    page: 1,
                  })
                }
              >
                <X /> Clear filter
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <table className="w-full text-xs my-4">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left p-3">DOCUMENT</th>
                <th className="text-left p-3">TYPE</th>
                <th className="text-left p-3">STAFF</th>
                <th className="text-left p-3">CATEGORY</th>
                <th className="text-left p-3">SIZE</th>
                <th className="text-left p-3">STATUS</th>
                <th className="text-left p-3">UPLOAD DATE/TIME</th>
                <th className="text-right p-3">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={Box}
                      className=""
                      title="No documents"
                      description={
                        filters.category || filters.status
                          ? `No document match filter ${filters.category || ""}${filters.status || ""}`
                          : "You have no documents uploaded."
                      }
                    />
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleView(doc.id)}
                    className="border-b hover:bg-muted/30 transition"
                  >
                    <td className="p-3 text-sm">{doc.fileName}</td>
                    {/*MIMETYPE*/}
                    <td className="p-3">
                      <div className="flex flex-col">
                        {/*<span className="font-medium">{doc.}</span>*/}
                        <span className="text-xs text-muted-foreground">
                          {getFileType(doc.mimeType)}
                        </span>
                      </div>
                    </td>
                    {/*STAFF*/}
                    <td className="p-3 text-sm">
                      {doc.staff
                        ? [doc.staff.firstName, doc.staff.lastName].join(" ")
                        : doc.staffId}
                    </td>
                    {/*FILE CATEGORY*/}
                    <td className="p-3 text-sm">{doc.category}</td>
                    {/*FILE SIZE*/}
                    <td className="p-3 text-sm">{doc.fileSize}</td>
                    {/*STATUS*/}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === "Verified"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    {/*UPLOAD DATE/TIME*/}
                    <td className="p-3 text-sm">
                      {new Date(doc.createdAt).toDateString()}
                    </td>
                    {/*ACTIONS*/}
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
          {pagination && (
            <Paginator
              isFetching={isFetching}
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPrevPage}
              fetchNextPage={() => changeFilter({ page: filters.page + 1 })}
              fetchPreviousPage={() => changeFilter({ page: filters.page - 1 })}
              onRowsPerPageChange={(limit) => changeFilter({ limit })}
            />
          )}
        </CardContent>
      </Card>
      {/* VIEW MODAL */}
      {viewOpen && docDetail && (
        <EmployeeDocumentDetails
          details={docDetail}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

// ── EXPORT ────────────────────────────────────────────────────────
export function EmployeeDocumentList() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<TableShimmer />}>
        <DocumentsTable />
      </Suspense>
    </QueryErrorBoundary>
  );
}
