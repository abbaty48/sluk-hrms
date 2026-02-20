import {
  LucideX,
  LucideCheck,
  LucideImport,
  LucideLoader2,
  LucideAlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@sluk/src/components/ui/dialog";
import { toast } from "sonner";
import { parse } from "papaparse";
import React, { useState, useRef } from "react";
import { Button } from "@sluk/src/components/ui/button";
import { Progress } from "@sluk/src/components/ui/progress";
import { Alert, AlertDescription } from "@sluk/src/components/ui/alert";

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

interface Department {
  id: string;
  name: string;
}

interface ImportState {
  open: boolean;
  progress: number;
  file: File | null;
  isImporting: boolean;
  importResult: ImportResult | null;
}

interface ImportEmployeesProps {
  onImportComplete?: () => void;
  allPages?: {
    data: Array<{
      department: Department;
      rank?: string;
    }>;
  }[];
}

export function ImportEmployees({ onImportComplete }: ImportEmployeesProps) {
  const [state, setState] = useState<ImportState>({
    file: null,
    open: false,
    progress: 0,
    isImporting: false,
    importResult: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to update specific state fields
  const updateState = (updates: Partial<ImportState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Normalize CSV keys (handle both formats)
  const normalizeRow = (row: any): any => {
    const keyMap: Record<string, string> = {
      "Staff No": "staffNo",
      staffNo: "staffNo",
      Name: "name",
      name: "name",
      Email: "email",
      email: "email",
      Phone: "phone",
      phone: "phone",
      Gender: "gender",
      gender: "gender",
      "Date of Birth": "dateOfBirth",
      dateOfBirth: "dateOfBirth",
      Department: "department",
      department: "department",
      departmentId: "departmentId",
      Rank: "rank",
      rank: "rank",
      rankId: "rankId",
      Cadre: "cadre",
      cadre: "cadre",
      Category: "staffCategory",
      staffCategory: "staffCategory",
      Status: "status",
      status: "status",
      State: "state",
      state: "state",
      LGA: "lga",
      lga: "lga",
    };

    return Object.keys(row).reduce((acc, key) => {
      const normalizedKey = keyMap[key] || key;
      acc[normalizedKey] = row[key];
      return acc;
    }, {} as any);
  };

  // CSV Template headers
  const templateHeaders = [
    "staffNo",
    "name",
    "email",
    "phone",
    "gender",
    "dateOfBirth",
    "departmentId",
    "rankId",
    "rank",
    "cadre",
    "staffCategory",
    "status",
    "state",
    "lga",
  ];

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = [
      templateHeaders.join(","),
      "SP/XXXX,John Doe,john.doe@example.com,08012345678,Male,1990-01-15,dept_1,rank_5,Lecturer II,Teaching,Senior,Employed,Jigawa,Kafin Hausa",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employee_import_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);

    toast.error("Template Downloaded", {
      description:
        "Fill in the template with employee data. You can also import exported CSV files.",
    });
  };

  // Validate CSV row
  const validateRow = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.staffNo) errors.push("Staff No is required");
    if (!data.name) errors.push("Name is required");
    if (!data.email) errors.push("Email is required");
    if (!data.department && !data.department)
      errors.push("Department is required");
    if (!data.rank) errors.push("Rank is required");
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }

    return { valid: errors.length === 0, errors };
  };

  // Process CSV file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.warning("Invalid File", {
        description: "Please upload a CSV file",
      });
      return;
    }

    updateState({ file: selectedFile, importResult: null });
  };

  // Import employees from CSV
  const handleImport = async () => {
    if (!state.file) return;

    updateState({ isImporting: true, progress: 0 });

    parse(state.file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const totalRows = results.data.length;
        const importResults: ImportResult = {
          success: 0,
          failed: 0,
          errors: [],
        };

        for (let i = 0; i < totalRows; i++) {
          const rawRow = results.data[i] as any;
          const row = normalizeRow(rawRow);

          updateState({ progress: ((i + 1) / totalRows) * 100 });

          const validation = validateRow(row);
          if (!validation.valid) {
            importResults.failed++;
            importResults.errors.push({
              row: i + 2,
              error: validation.errors.join(", "),
              data: rawRow,
            });
            continue;
          }

          if (!row.department) {
            importResults.failed++;
            importResults.errors.push({
              row: i + 2,
              error: `Department not found: ${row.department || "N/A"}`,
              data: rawRow,
            });
            continue;
          }

          if (!row.rank) {
            importResults.failed++;
            importResults.errors.push({
              row: i + 2,
              error: `Rank not found: ${row.rank || "N/A"}`,
              data: rawRow,
            });
            continue;
          }

          importResults.success++;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        updateState({
          importResult: importResults,
          isImporting: false,
          progress: 100,
        });

        toast.success("Import Complete", {
          description: `Success: ${importResults.success}, Failed: ${importResults.failed}`,
        });

        if (importResults.success > 0 && onImportComplete) {
          onImportComplete();
        }
      },
      error: () => {
        toast.error("Import Failed", {
          description: "Failed to parse CSV file",
        });
        updateState({ isImporting: false });
      },
    });
  };

  // Reset state
  const handleClose = () => {
    setState({
      open: false,
      file: null,
      isImporting: false,
      importResult: null,
      progress: 0,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={state.open} onOpenChange={(open) => updateState({ open })}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">
          <LucideImport />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Employees from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple employees. You can import
            exported CSV files or use the template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span>Download template or import your exported CSV files.</span>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                Download Template
              </Button>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={state.isImporting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {state.file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LucideCheck className="h-4 w-4 text-green-500" />
                <span>{state.file.name}</span>
                {!state.isImporting && (
                  <button
                    onClick={() => {
                      updateState({ file: null });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-auto"
                  >
                    <LucideX className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {state.isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing employees...</span>
                <span>{Math.round(state.progress)}%</span>
              </div>
              <Progress value={state.progress} />
            </div>
          )}

          {state.importResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <LucideCheck className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Successful</p>
                      <p className="text-2xl font-bold">
                        {state.importResult.success}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <LucideX className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Failed</p>
                      <p className="text-2xl font-bold">
                        {state.importResult.failed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {state.importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Errors:</p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {state.importResult.errors
                      .slice(0, 10)
                      .map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <LucideAlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <span className="font-medium">
                              Row {error.row}:
                            </span>{" "}
                            {error.error}
                          </AlertDescription>
                        </Alert>
                      ))}
                    {state.importResult.errors.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center">
                        ... and {state.importResult.errors.length - 10} more
                        errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={state.isImporting}
          >
            {state.importResult ? "Close" : "Cancel"}
          </Button>
          {!state.importResult && (
            <Button
              onClick={handleImport}
              disabled={!state.file || state.isImporting}
            >
              {state.isImporting ? (
                <>
                  <LucideLoader2 className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <LucideImport />
                  Import
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
