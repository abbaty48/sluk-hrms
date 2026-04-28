import { cn } from "@/lib/utils";
import type { TStaff } from "@/types/staffTypes";
import { ExportEmployees } from "./AdminEmployeesExport";
import { ImportEmployees } from "./AdminEmployeesImport";

type Align = "right" | "left" | "center";

function placement(align: Align) {
  switch (align) {
    case "right":
      return "place-self-end";
    case "left":
      return "place-self-start";
    case "center":
      return "place-self-center";
  }
}

interface AdminEmployeesPageFeaturesProps<T> {
  align: "right" | "left" | "center";
  currentPageData: T[];
  allPages?: { data: T[] }[];
  onImportComplete?: () => void;
}

export function AdminEmployeesPageFeatures({
  align,
  allPages,
  currentPageData,
  onImportComplete,
}: AdminEmployeesPageFeaturesProps<TStaff>) {
  return (
    <menu className={cn("flex items-center gap-2 list-none", placement(align))}>
      <ImportEmployees onImportComplete={onImportComplete} />
      <ExportEmployees currentPageData={currentPageData} allPages={allPages} />
    </menu>
  );
}
