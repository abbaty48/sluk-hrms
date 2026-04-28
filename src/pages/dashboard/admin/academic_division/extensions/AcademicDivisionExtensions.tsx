import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@sluk/src/components/ui/select";
import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Button } from "@sluk/src/components/ui/button";
import { ExtensionDialog } from "./AcademicDivisionExtensionsDialog";
import { AcademicDivisionExtensionsList } from "./AcademicDivisionExtensionsList";
import type { TExtensionRequestStatus } from "@sluk/src/types/academicDivisionTypes";

export function AcademicDivisionExtensions() {
  const [status, setStatus] = useState<TExtensionRequestStatus | "null">(
    "null",
  );
  const [openAddExtension, setOpenAddExtension] = useState(false);
  return (
    <>
      <div className="space-y-2 p-2">
        {/*Header - Filter and Add button*/}
        <div className="flex items-center justify-between">
          {/*Filter*/}
          <Select
            defaultValue="null"
            onValueChange={(value) =>
              setStatus(value as TExtensionRequestStatus)
            }
          >
            <SelectTrigger>
              <Filter />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved </SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {/*Add Button*/}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOpenAddExtension(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Extension Request
          </Button>
        </div>
        {/*List*/}
        <AcademicDivisionExtensionsList status={status} />
      </div>

      {/* DIALOG */}
      <ExtensionDialog
        open={openAddExtension}
        onOpenChange={setOpenAddExtension}
      />
    </>
  );
}
