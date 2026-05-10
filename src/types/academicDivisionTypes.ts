import type { TPagination } from "./types.ts";

export type TAcademicStats = {
  OnStudyLeave: number;
  PhdCandidate: number;
  BscCandidate: number;
  PgdCandidate: number;
  MscCandidate: number;
  StudyAbroad: number;
};
export type TStaffOnStudyLeave = {
  degreeType: string;
  payStatus: "WithPayment" | "WithoutPayment";
  durationYear: number;
  leaveCategory: "Study" | "Work";
  studyMode: string;
  institution: string;
  programme: string;
  sponsorshipType:
    | "Self"
    | "StateGovernment"
    | "University"
    | "TedFund"
    | "Others";
  country: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    faculty: string;
    department: string;
  };
};

export type TStaffOnStudyLeaveList = {
  data: TStaffOnStudyLeave[];
  pagination: TPagination | null;
};

export type TChartAccademicSponsorshipDistribution = {
  name: string;
  color: string;
  value: number;
  percentage: number;
}[];

export type TChartAccademicStudyLeaveByFaculty = {
  label: string;
  value: number;
}[];

// study by faculty
export type TStudyLeaveByFaculty = {
  faculty: string;
  studyCount: number;
}[];

export type TExtensionRequestExtension = "First" | "Second" | "Final";
export type TExtensionRequestStatus = "Pending" | "Approved" | "Rejected";

export type TExtensionRequestForm = {
  staffId: string;
  reason: string | null;
  durationMonths: number;
  extension: TExtensionRequestExtension;
};

export type TExtensionRequest = {
  id: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    faculty: string;
    department: string;
  };
  reason: string;
  durationMonths: number;
  extension: TExtensionRequestExtension;
  status: TExtensionRequestStatus;
  duration: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
};

export type TExtensionRequestList = {
  data: TExtensionRequest[];
  pagination: TPagination | null;
};

export type TStudyStaffQuery = {
  sponsorship: string | null;
  degreeType: string | null;
  type: string | null;
  limit: string | null;
  page: string | null;
  q: string | null;
};
