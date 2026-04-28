import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { TQualification } from "@sluk/src/types/qualificationTypes";
import { useEmployeeQualifications } from "@sluk/src/hooks/api/useEmployeeAPI";
import { QualificationsSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeeQualificationSkeleton";

export default function EmployeeQualifications() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<QualificationsSkeleton />}>
        <Qualifications />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}
function Qualifications() {
  const { data: qualifications } = useEmployeeQualifications();

  return (
    <div className="m-4">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Academic Qualifications</h2>

        {qualifications?.map((q: TQualification) => (
          <div
            key={q.id}
            className="flex items-center gap-4 p-4 rounded-lg border bg-background"
          >
            {/* ICON */}
            <div className="p-3 rounded-lg bg-muted">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <p className="font-medium">{q.degree}</p>
              <p className="text-sm text-primary">{q.institution}</p>
              <p className="text-xs text-muted-foreground">{q.year}</p>
            </div>

            {/* BADGE */}
            {q.isHighest && (
              <span className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full">
                Highest
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
