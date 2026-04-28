import { Suspense } from "react";
import { FileBox } from "lucide-react";
import { ResponsiveContainer } from "recharts";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { useSponsorshipDistribution } from "@sluk/src/hooks/api/useAcademicDivisionAPI";

export function AcademicStudyLeaveByFacultyChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Study Leave by Faculty
        </h3>
      </CardHeader>
      <CardContent className="recharts-responsive-container w-full">
        <QueryErrorBoundary>
          <Suspense
            fallback={
              <div className="rounded-3xl w-inherit min-h-[20vh] h-[50vh] shimmer"></div>
            }
          >
            <SponshorshipDistributionChart />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}

export default function SponshorshipDistributionChart() {
  const { data } = useSponsorshipDistribution();

  if (!data) {
    return (
      <div className="min-h-[40vh] rounded-xl w-full shimmer flex items-center justify-center gap-4">
        <FileBox /> Missing data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <></>
    </ResponsiveContainer>
  );
}
