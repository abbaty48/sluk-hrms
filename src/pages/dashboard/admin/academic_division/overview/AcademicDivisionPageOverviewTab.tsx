import { AcademicStudyLeaveByFacultyChart } from "../Charts/AcademicStudyByFacultyChart";
import { AcademicDivisionPageOverviewLeaves } from "./AcademicDivisionPageOverviewLeaves";
import { AcademicSponsorshipDistributionChart } from "../Charts/AcademicSponsorshipDistributionChart";

export function AcademicDivisionPageOverviewTab() {
  return (
    <article className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AcademicSponsorshipDistributionChart />
        <AcademicStudyLeaveByFacultyChart />
      </div>
      <AcademicDivisionPageOverviewLeaves />
    </article>
  );
}
