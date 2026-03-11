
import { EmployeeDocumentsUpload } from "@sluk/src/pages/dashboard/employee/EmployeeDocs/EmployeeDocumentUpload"
import { EmployeeDocumentsSummary } from "@sluk/src/pages/dashboard/employee/EmployeeDocs/EmployeeDocsSummary"
import { EmployeeDocumentsTable } from "@sluk/src/pages/dashboard/employee/EmployeeDocs/EmployeeTableDocs"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useState } from "react"

export const Component = function EmployeeDocumentsPage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false)

  return (
    <>
      <div className="space-y-8 p-4">

        {/* HEADER */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-semibold">My Documents</h2>
            <p className="text-sm text-muted-foreground">
              Manage your personal and professional documents.
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpened(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>

        {/* SUMMARY */}
        <EmployeeDocumentsSummary />

        {/* TABLE */}
        <EmployeeDocumentsTable />

      </div>

      {/* DIALOG */}
      <EmployeeDocumentsUpload
        isDialog={isDialogOpened}
        setDialog={setIsDialogOpened}
      />
    </>
  )
}
