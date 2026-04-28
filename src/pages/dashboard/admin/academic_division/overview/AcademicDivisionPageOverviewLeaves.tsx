import { useState } from "react";
import type { TStudyStaffQuery } from "@sluk/src/types/academicDivisionTypes";
import { AcademicDivisionPageFilters } from "./AcademicDivisionPageOverviewFilters";
import { AcademicDivisionPageOverviewTable } from "./AcademicDivisionPageOverviewTable";

export type TADPOverviewActions =
  | { action: "SET_q"; value: string | null }
  | { action: "SET_page"; value: string | null }
  | { action: "SET_type"; value: string | null }
  | { action: "SET_limit"; value: string | null }
  | { action: "SET_degreeType"; value: string | null }
  | { action: "SET_sponsorship"; value: string | null };

export function AcademicDivisionPageOverviewLeaves() {
  const [filters, setFilters] = useState<TStudyStaffQuery>({
    q: null,
    type: null,
    page: "1",
    limit: "5",
    degreeType: null,
    sponsorship: null,
  });

  const xFilters = (key: string, value: string | null) => {
    setFilters((prevs) => ({
      ...prevs,
      [key]: value,
    }));
  };

  const changeFilter = ({ action, value }: TADPOverviewActions) => {
    switch (action) {
      case "SET_q":
        return xFilters("q", value);
      case "SET_page":
        return xFilters("page", value);
      case "SET_type":
        return xFilters("type", value);
      case "SET_limit":
        return xFilters("limit", value);
      case "SET_degreeType":
        return xFilters("degreeType", value);
      case "SET_sponsorship":
        return xFilters("sponsorship", value);
    }
  };

  const resetFilters = () => {
    setFilters({
      q: null,
      type: null,
      page: "1",
      limit: "5",
      degreeType: null,
      sponsorship: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <AcademicDivisionPageFilters
        resetFilters={resetFilters}
        changeFilter={changeFilter}
        filters={filters}
      />
      {/* Leaves Table */}
      <AcademicDivisionPageOverviewTable
        changeFilter={changeFilter}
        filters={filters}
      />
    </div>
  );
}
