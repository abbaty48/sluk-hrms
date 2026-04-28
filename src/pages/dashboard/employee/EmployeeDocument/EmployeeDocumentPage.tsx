import { EmployeeDocumentUpload } from "@sluk/src/pages/dashboard/employee/EmployeeDocument/EmployeeDocumentUpload";
import { EmployeeDocumentList } from "@sluk/src/pages/dashboard/employee/EmployeeDocument/EmployeeDocumentList";
import { EmployeeDocumentSummary } from "./EmployeeDocumentSummary";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";

export const Component = function EmployeeDocumentsPage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  return (
    <>
      <div className="space-y-8 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-semibold page-title">My Documents</h2>
            <p className="text-sm text-muted-foreground page-subtitle">
              Manage your personal and professional documents.
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpened(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>

        {/* SUMMARY */}
        <EmployeeDocumentSummary />

        {/* TABLE */}
        <EmployeeDocumentList />
      </div>

      {/* DIALOG */}
      <EmployeeDocumentUpload
        isDialog={isDialogOpened}
        setDialog={setIsDialogOpened}
      />
    </>
  );
};
