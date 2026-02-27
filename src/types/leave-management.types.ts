// types/leave-management.types.ts

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";


export type LeaveResponse = {
  id: string;
  staff: {
    name: string;
    staffNo: string;
    department: string;
  }
  startDate: string;
  endDate: string;
  reason: string;
  duration: string;
  status: LeaveStatus;
  allowedDays: number;
  leaveType: string;
}

export interface LeaveType {
  id: string;
  name: string;
  allowedDays: number;
  carryForward: boolean;
  maxCarryForward: number;
  paidLeave: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LeaveRequest = {
  id: string;
  staffId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number,
  reason: string,
  status: LeaveStatus,
  approverId: string | null,
  approverComments: string | null,
  appliedAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeaveStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

export type LeaveFilters = {
  leaves: LeaveResponse[];
  search: string;
  status: string;
  type: string;
  limit: string;
  fromDate?: Date;
  toDate?: Date;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type LeaveRequestResponse = {
  data: LeaveRequest[];
  pagination: PaginationInfo;
};

export type LeaveTypeFormData = {
  name: string;
  days: number;
  description?: string;
};

export type LeaveRequestFormData = {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
};

export type ApprovalAction = {
  requestId: string;
  status: "approved" | "rejected";
  comment?: string;
};


export interface LeaveTypeDistribution {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface LeaveApplication {
  staffId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string;
}

export interface LeaveApproval {
  status: LeaveStatus;
  comments: string;
  approverId: string;
}

export interface LeaveCalendarEntry {
  date: string;
  staffId: string;
  staffName: string;
  leaveType: string;
  totalDays: number;
  status: LeaveStatus;
}

export interface LeaveConflict {
  conflictCount: number;
  staffOnLeave: string[];
  details: {
    staffId: string;
    name: string;
    leaveType: string;
    dates: string;
  }[];
}

export interface LeaveTrend {
  month: string;
  applications: number;
  approvals: number;
  rejections: number;
  pending: number;
}

export interface LeaveUtilization {
  department: string;
  departmentId: string;
  totalAllowed: number;
  utilized: number;
  remaining: number;
  utilizationRate: number;
}

export interface LeaveEligibility {
  eligible: boolean;
  remainingDays: number;
  reason?: string;
  warnings?: string[];
}

export interface LeaveValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  conflicts: string[];
}

export interface LeaveBalance {
  leaveType: string;
  allowed: number;
  used: number;
  remaining: number;
}
