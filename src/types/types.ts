import type { TNotification, TNotificationPreferences } from "./notifications-types";
import type { TLeaveRequest, TLeaveType } from "./leave-management.types";
import type { TAttendance } from "./attendance.types";
import type { TStaff } from "./staff-types";
import type { TUser } from "./user-types";
import type { Request } from "express";

export type TQualification = {
  id: string;
  staffId: string;
  degree: string;
  institution: string;
  year: string;
  level: string;
  isHighest: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TEmploymentHistory = {
  id: string;
  staffId: string;
  position: string;
  department: string;
  subject: string | null;
  startDate: string;
  endDate: string; // "Present" or "MMM YYYY"
  isCurrent: boolean;
}

export type TDepartment = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  headId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TRank = {
  id: string;
  title: string;
  level: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TPayroll = {
  id: string;
  staffId: string;
  month: number;
  year: number;
  basicSalary: number;
  totalAllowances: number;
  paymentDate: string | null;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: string;
  processedBy: string | null;
  processedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;

}

export type TDocument = {
  id: string;
  staffId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TAnnouncement = {
  id: string;
  title: string;
  content: string;
  priority: string;
  publishedBy: string;
  publishedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Database Interface
export type TDatabase = {
  users: TUser[];
  ranks: TRank[];
  staff: TStaff[];
  payrolls: TPayroll[];
  documents: TDocument[];
  leaves: TLeaveRequest[];
  leaveTypes: TLeaveType[];
  attendance: TAttendance[];
  departments: TDepartment[];
  announcements: TAnnouncement[];
  qualifications: TQualification[];
  employmentHistory: TEmploymentHistory[];
  notifications: TNotification[],
  notificationPreferences: TNotificationPreferences[];
  EmploymentHistoryResponse: TEmploymentHistoryResponse[];

}

// Request Interfaces
export type TAuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
    staffId: string;
  };
}

// Response DTOs
export type TDashboardStats = {
  totalStaff: number;
  totalStaffChange: number; // % change from last month
  activeStaff: number;
  activeStaffChange: number;
  presentToday: number;
  onLeaveToday: number;
  onLeaveChange: number;
  attendanceRate: string;
  attendanceRateChange: number;
  pendingActions: number;
  lateArrivals: number;
  avgWorkHours: number;
  teachingStaff: number;
  nonTeachingStaff: number;
  totalDepartments: number;
}



export type TDepartmentSummary = {
  departmentId: string;
  departmentName: string;
  staffCount: number;
  teachingStaff: number;
  nonTeachingStaff: number;
  seniorStaff: number;
  juniorStaff: number;
}


export type TEmploymentHistoryResponse = {
  data: TEmploymentHistory[]
  nextPage: number | null
}

// Auth DTOs
export type TLoginRequest = {
  email: string;
  password: string;
}

export type TLoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    staff?: TStaff;
  };
}

export type TRegisterRequest = {
  email: string;
  password: string;
  staffId?: string;
}

export type TRegisterResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};
