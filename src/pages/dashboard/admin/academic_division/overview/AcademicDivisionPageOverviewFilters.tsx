import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@sluk/src/components/ui/select";
import { Filter, LucideSearch } from "lucide-react";
import { Button } from "@sluk/src/components/ui/button";
import { Card, CardContent } from "@sluk/src/components/ui/card";
import type { TADPOverviewActions } from "./AcademicDivisionPageOverviewLeaves";
import type { TStudyStaffQuery } from "@sluk/src/types/academicDivisionTypes";

type Props = {
  filters?: TStudyStaffQuery;
  changeFilter: ({ action, value }: TADPOverviewActions) => void;
};

/** */
function AcademicDivisionPageSearchFilter({ changeFilter }: Props) {
  return (
    <div className="relative flex-1">
      <LucideSearch className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
        placeholder="Search by programme or institution..."
        onChange={(e) =>
          changeFilter({ action: "SET_q", value: e.target.value })
        }
      />
    </div>
  );
}
/** */
function AcademicDivisionPageSponsorshipFilter({ changeFilter }: Props) {
  return (
    <Select
      defaultValue="null"
      onValueChange={(value) =>
        changeFilter({ action: "SET_sponsorship", value })
      }
    >
      <SelectTrigger>
        <Filter />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null">All Sponsorships</SelectItem>
        <SelectItem value="TetFund">Tetfund</SelectItem>
        <SelectItem value="Self">Self Sponsorship </SelectItem>
        <SelectItem value="StateGovernment">State Govt Sponsorship </SelectItem>
        <SelectItem value="University">University Sponsorship </SelectItem>
        <SelectItem value="other">Others </SelectItem>
      </SelectContent>
    </Select>
  );
}
/** */
function AcademicDivisionPageDegreeFilter({ changeFilter }: Props) {
  return (
    <Select
      defaultValue={"null"}
      onValueChange={(value) =>
        changeFilter({ action: "SET_degreeType", value })
      }
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null">All Degrees</SelectItem>
        <SelectItem value="BSC">Bsc</SelectItem>
        <SelectItem value="MSC">Msc</SelectItem>
        <SelectItem value="PGD">PGD</SelectItem>
      </SelectContent>
    </Select>
  );
}
/** */
function AcademicDivisionPageTypeFilter({ changeFilter }: Props) {
  return (
    <Select
      defaultValue="null"
      onValueChange={(value) => changeFilter({ action: "SET_type", value })}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"null"}>All Types</SelectItem>
        <SelectItem value="studyLeave">Study Leave</SelectItem>
        <SelectItem value="workLeave">Work Leave</SelectItem>
      </SelectContent>
    </Select>
  );
}
/** */
export function AcademicDivisionPageFilters({
  changeFilter,
  resetFilters,
  filters,
}: {
  resetFilters: () => void;
} & Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <form className="flex flex-col sm:flex-row gap-3">
          {/* Search Filter*/}
          <AcademicDivisionPageSearchFilter changeFilter={changeFilter} />
          {/* Sponsorship Filter*/}
          <AcademicDivisionPageSponsorshipFilter changeFilter={changeFilter} />
          {/* Degree Filter*/}
          <AcademicDivisionPageDegreeFilter changeFilter={changeFilter} />
          {/* Type Filter*/}
          <AcademicDivisionPageTypeFilter changeFilter={changeFilter} />
        </form>
        {(filters?.q ||
          filters?.type ||
          filters?.degreeType ||
          filters?.sponsorship) && (
          <Button variant={"ghost"} type="button" onClick={resetFilters}>
            Clear filter
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
