import { Suspense } from "react";
import { FileBox } from "lucide-react";
import { Tooltip } from "@sluk/src/components/ui/tooltip";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { useStaffPerDepartmentAPI } from "@sluk/src/hooks/api/useAdminApi";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export function AdminStaffPerDepartmentChart() {
  return (
    <Card className="p-4">
      <CardHeader>
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Staff per Department
        </h3>
      </CardHeader>
      <CardContent>
        <QueryErrorBoundary>
          <Suspense
            fallback={
              <div className="rounded-3xl w-inherit min-h-[20vh] h-[40vh] shimmer"></div>
            }
          >
            <StaffsPerDepartment />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}

function StaffsPerDepartment() {
  const { data } = useStaffPerDepartmentAPI();

  if (!data) {
    return (
      <div className="min-h-[40vh] rounded-xl w-full shimmer flex items-center justify-center gap-4">
        <FileBox /> Missing data
      </div>
    );
  }

  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        fontSize: "0.65rem",
        aspectRatio: 2,
      }}
      responsive
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" alignmentBaseline="hanging" />
      <XAxis
        dataKey="departmentName"
        stroke="inherit"
        style={{ fill: "hsl(30 55% 42%)" }}
      />
      <YAxis
        width="auto"
        strokeDasharray={3}
        stroke="inherit"
        style={{ fill: "hsl(30 55% 42%)" }}
      />
      <Tooltip />
      <Legend />

      <Bar dataKey="staffCount" fill="hsl(30 55% 42%)" radius={[2, 2, 0, 0]} />
    </BarChart>
  );
}
