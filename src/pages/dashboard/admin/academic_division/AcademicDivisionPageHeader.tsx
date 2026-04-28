import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function AcademicDivisionPageHeader() {
  const handleExportCSV = async () => {};

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title text-3xl font-bold text-foreground">
          Academic Division
        </h1>
        <p className="page-subtitle text-muted-foreground">
          Study leave tracking, sponsorship oversight & academic staff
          development
        </p>
      </div>
      <Button variant="outline" onClick={handleExportCSV}>
        <Download className="h-4 w-4 mr-1" />
        Export CSV
      </Button>
    </div>
  );
}
