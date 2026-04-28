import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { StatsShimmerGrid } from "@/components/DashboardShimmer";
import { TrendingUp, GraduationCap, BookOpen, Globe } from "lucide-react";
import { useAcademicDivisionStats } from "@sluk/src/hooks/api/useAcademicDivisionAPI";

export function AcademicDivisionPageStats() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<StatsShimmerGrid />}>
        <AcademicDivisionStats />
      </Suspense>
    </QueryErrorBoundary>
  );
}

export function AcademicDivisionStats() {
  const { data: stats } = useAcademicDivisionStats();

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
    <div className="grid grid-cols-[repeat(auto-fill,minmax(25em,1fr))] gap-4 mb-6">
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              On Study Leaves
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.OnStudyLeave || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
            <GraduationCap className="stroke-info!" />
          </div>
        </CardContent>
      </Card>
      {/*Phd Candidates*/}
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Phd Candidates
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.PhdCandidate || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <BookOpen className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
      {/*Bsc Candidate*/}
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Bsc Candidates
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.BscCandidate || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <BookOpen className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
      {/*Pgd Candidate*/}
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pgd Candidates
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.PgdCandidate || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <BookOpen className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
      {/*Msc Candidate*/}
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Msc Candidates
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.MscCandidate || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
            <TrendingUp className="stroke-warning!" />
          </div>
        </CardContent>
      </Card>
      {/*Studing Abroad*/}
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Studying Abroad
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats.StudyAbroad || 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Globe className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
