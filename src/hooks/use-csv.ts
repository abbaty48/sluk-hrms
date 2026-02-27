import { useState } from "react";

interface ExportState {
  isExporting: boolean;
}

interface Feedback {
  title: string;
  message: string;
}

// Generic column definition for any data type
export interface CSVColumn<T> {
  header: string;
  accessor: (item: T) => string | number | null | undefined;
}

// Generic Export Hook
export function useCSVExporter<T>({
  currentPageData,
  allPages,
  columns,
  filename,
  filters = {},
  fetchAllData,
  onErrorExport,
  onSuccessExport,
  onErrorSave,
  onSuccessSave,
}: {
  filename: string;
  exportLabel?: string;
  currentPageData: T[];
  columns: CSVColumn<T>[];
  allPages?: { data: T[] }[];
  filters?: Record<string, any>;
  fetchAllData?: (filters: any) => Promise<T[]>;
  onSuccessSave?: (feedback: Feedback) => void;
  onSuccessExport?: (feedback: Feedback) => void;
  onErrorExport?: (feedback: Feedback) => void;
  onErrorSave?: (feedback: Feedback) => void;
}) {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
  });

  const updateState = (updates: Partial<ExportState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Format data for CSV export
  const formatDataForCSV = (data: T[]): (string | number)[][] => {
    return data.map((item) =>
      columns.map((col) => {
        const value = col.accessor(item);
        return value !== null && value !== undefined ? value : "N/A";
      }),
    );
  };

  // Convert data to CSV string
  const convertToCSV = (data: T[]): string => {
    const headers = columns.map((col) => col.header);
    const formattedData = formatDataForCSV(data);

    const csvRows = [
      headers.join(","),
      ...formattedData.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(","),
      ),
    ];
    return csvRows.join("\n");
  };

  // Generate filename with timestamp
  const getFilename = (type: "current" | "cached" | "all"): string => {
    const timestamp = new Date().toISOString().split("T")[0];
    const hasFilters = Object.values(filters).some((v) => v);
    const filterInfo = hasFilters ? "_filtered" : "";
    return `${filename}_${type}_${timestamp}${filterInfo}.csv`;
  };

  // Save file using File System Access API or fallback to download
  const saveCSVFile = async (csvContent: string, filename: string) => {
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: "CSV Files",
              accept: {
                "text/csv": [".csv"],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(csvContent);
        await writable.close();
        onSuccessSave?.({
          title: "Export Successful",
          message: `File saved as ${filename}`,
        });
      } catch (error: any) {
        if (error.name === "AbortError") {
          onErrorSave?.({
            title: "Export Cancelled",
            message: "File save was cancelled",
          });
        } else {
          onErrorSave?.({
            title: "Export Failed",
            message: "Failed to save file. Please try again.",
          });
        }
      }
    } else {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      onSuccessSave?.({
        title: "Export Successful",
        message: `File saved as ${filename}`,
      });
    }
  };

  // Handle current page export
  const handleCurrentPageExport = async () => {
    updateState({ isExporting: true });
    try {
      const csvContent = convertToCSV(currentPageData);
      const filenameWithExt = getFilename("current");
      await saveCSVFile(csvContent, filenameWithExt);
      onSuccessSave?.({
        title: "Export Successful",
        message: `File saved as ${filename}`,
      });
    } catch {
      onErrorExport?.({
        title: "Export Failed",
        message: "Failed to export current page data's. Please try again.",
      });
    } finally {
      updateState({ isExporting: false });
    }
  };

  // Handle cached pages export
  const handleCachedPagesExport = async () => {
    if (!allPages || allPages.length === 0) {
      onErrorExport?.({
        title: "No Cached Data.",
        message: "No pages have been loaded yet",
      });
      return;
    }

    updateState({ isExporting: true });
    try {
      const allData = allPages.flatMap((page) => page.data || []);
      const csvContent = convertToCSV(allData);
      const filenameWithExt = getFilename("cached");

      await saveCSVFile(csvContent, filenameWithExt);

      onSuccessExport?.({
        title: "Data Exported",
        message: `Exported ${allData.length} records from ${allPages.length} cached pages`,
      });
    } catch {
      onErrorExport?.({
        title: "Export Failed.",
        message: "Failed to export data. Please try again.",
      });
    } finally {
      updateState({ isExporting: false });
    }
  };

  // Fetch all data and export
  const handleAllDataExport = async () => {
    if (!fetchAllData) {
      onErrorExport?.({
        title: "Export All Not Available",
        message: "Fetching all data is not supported for this export",
      });
      return;
    }

    updateState({ isExporting: true });
    try {
      const allData = await fetchAllData(filters);
      const csvContent = convertToCSV(allData);
      const filenameWithExt = getFilename("all");

      await saveCSVFile(csvContent, filenameWithExt);

      onSuccessExport?.({
        title: "Data Fetched",
        message: `Prepared ${allData.length} records for export`,
      });
    } catch {
      onErrorExport?.({
        title: "Export Failed",
        message: "Failed to export data. Please try again.",
      });
    } finally {
      updateState({ isExporting: false });
    }
  };

  return {
    state,
    getFilename,
    saveCSVFile,
    convertToCSV,
    formatDataForCSV,
    handleAllDataExport,
    handleCachedPagesExport,
    handleCurrentPageExport,
  };
}
