import {
  Users,
  Filter,
  FileText,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";
import {
  AdminReportPageSkeletonChartCard,
  AdminReportPageSkeletonPieChartCard,
  AdminReportPageSkeletonMonthlyChartCard,
} from "./AdminReportAnalyticPageSkeleton";
import { Motion } from "@/components/Motion";
import { ARAPChart } from "./charts/ARAPChart";
import { Button } from "@/components/ui/button";
import { ARAPFilters } from "./AdminReportAnalyticPageFilters";
import { ARAPStaffStrengthChart } from "./charts/ARAPStaffStrengthChart";
import { ARAPStaffCategoryChart } from "./charts/ARAPStaffCategoryChart";
import { ARAPStaffDepartmentChart } from "./charts/ARAPStaffDepartmentChart";
import { ARAPFilterContextProvider } from "./AdminReportAnalyticPageProvider";
import { ARAPPayrollBreakdownChart } from "./charts/ARAPPayrollBreakdownChart";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { ARAPMonthlyLeaveUsageChart } from "./charts/ARAPMonthlyLeaveUsageChart";

export default function AdminReportsAnalyticsPage() {
  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log("Exporting to PDF...");
  };

  const handleExportExcel = () => {
    // Implement Excel export logic
    console.log("Exporting to Excel...");
  };

  return (
    <ARAPFilterContextProvider>
      <Motion
        element="main"
        className="flex-1 p-4 lg:p-6 overflow-auto space-y-6"
      >
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-y-8">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">
              Comprehensive HR analytics and insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-1.5"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="gap-1.5"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              <Filter className="h-4 w-4" />
              All Reports
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="h-4 w-4" />
              Staff Reports
            </TabsTrigger>
            <TabsTrigger value="leave">
              <CalendarDays className="h-4 w-4" />
              Leave Reports
            </TabsTrigger>
            <TabsTrigger value="payroll">
              <FileText className="h-4 w-4" />
              Payroll Reports
            </TabsTrigger>
          </TabsList>
          {/*  */}
          <ARAPFilters />
          {/*  */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ARAPChart
                title="Staff Strength Over Years"
                chart={ARAPStaffStrengthChart}
                fallback={<AdminReportPageSkeletonChartCard />}
                onDownload={() => {}}
              />
              <ARAPChart
                title="Staff by Category"
                chart={ARAPStaffCategoryChart}
                fallback={<AdminReportPageSkeletonPieChartCard />}
                onDownload={() => {}}
              />
            </div>

            <ARAPChart
              title="Staff by Department"
              chart={ARAPStaffDepartmentChart}
              fallback={
                <AdminReportPageSkeletonMonthlyChartCard height={280} />
              }
              onDownload={() => {}}
            />

            <ARAPChart
              title="Payroll Breakdown (monthly)."
              chart={ARAPPayrollBreakdownChart}
              fallback={<AdminReportPageSkeletonChartCard height={320} />}
              onDownload={() => {}}
            />
          </TabsContent>
          {/*  */}
          <TabsContent value="staff">
            <ARAPChart
              title="Staff by Department"
              chart={ARAPStaffDepartmentChart}
              fallback={
                <AdminReportPageSkeletonMonthlyChartCard height={280} />
              }
              onDownload={() => {}}
            />
          </TabsContent>
          {/*  */}
          <TabsContent value="leave">
            <ARAPChart
              title="Monthly Leave Usage."
              chart={ARAPMonthlyLeaveUsageChart}
              fallback={<AdminReportPageSkeletonChartCard height={300} />}
              onDownload={() => {}}
            />
          </TabsContent>
          {/*  */}
          <TabsContent value="payroll">
            <ARAPChart
              title="Payroll Breakdown (monthly)."
              chart={ARAPPayrollBreakdownChart}
              fallback={<AdminReportPageSkeletonChartCard height={320} />}
              onDownload={() => {}}
            />
          </TabsContent>
        </Tabs>
      </Motion>
    </ARAPFilterContextProvider>
  );
}
