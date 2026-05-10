import type {
  TNotification,
  TNotificationPreferences,
} from "./notificationsTypes.ts";
import type { TLeaveRequest, TLeaveType } from "./leave-managementTypes.ts";
import type { TNatureOfAppointment } from "./appointmentTypes.ts";
import type { IPasswordReset, TAuthUser } from "./authTypes.ts";
import type { TResponsibility } from "./responsibilityTypes.ts";
import type { TQualification } from "./qualificationTypes.ts";
import type { TSystemPreferences } from "./settingsTypes.ts";
import type { TAttendance } from "./attendance.types.ts";
import type { TDepartment } from "./departmentTypes.ts";
import type { TCommittee } from "./committeeTypes.ts";
import type { TDocument } from "./documentTypes.ts";
import type { TStaff } from "./staffTypes.ts";
import type { TRank } from "./rankTypes.ts";
import type { TEmploymentHistory } from "./employeeHistoryTypes.ts";

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
};

// export type TDocument = {
//   id: string;
//   staffId: string;
//   documentType: string;
//   fileName: string;
//   fileUrl: string;
//   uploadedBy: string;
//   uploadedAt: string;
//   expiryDate: string | null;
//   createdAt: string;
//   updatedAt: string;
// };

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
};

// Database Interface
export type TDatabase = {
  ranks: TRank[];
  staff: TStaff[];
  users: TAuthUser[];
  payrolls: TPayroll[];
  documents: TDocument[];
  leaves: TLeaveRequest[];
  committees: TCommittee[];
  leaveTypes: TLeaveType[];
  attendance: TAttendance[];
  departments: TDepartment[];
  notifications: TNotification[];
  announcements: TAnnouncement[];
  passwordResets: IPasswordReset[];
  qualifications: TQualification[];
  responsibilities: TResponsibility[];
  systemPreferences: TSystemPreferences;
  employmentHistory: TEmploymentHistory[];
  natureOfAppointments: TNatureOfAppointment[];
  EmploymentHistoryResponse: TEmploymentHistory[];
  notificationPreferences: TNotificationPreferences[];
};

// Request Interfaces
export type TAuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
    staffId: string;
  };
};

// Response DTOs
export type TDashboardStats = {
  // totalStaff: number;
  // totalStaffChange: number; // % change from last month
  // activeStaff: number;
  // activeStaffChange: number;
  // presentToday: number;
  // onLeaveToday: number;
  // onLeaveChange: number;
  // attendanceRate: string;
  // attendanceRateChange: number;
  // pendingActions: number;
  // lateArrivals: number;
  // avgWorkHours: number;
  // teachingStaff: number;
  // nonTeachingStaff: number;
  // totalDepartments: number;
  totalStaff: number;
  avgWorkHours: number;
  onLeaveChange: number;
  attendanceRate: string;
  todayAttendance: number;
  totalStaffChange: number;
  totalActiveStaff: number;
  activeStaffChange: number;
  totalLateArrivals: number;
  totalDepartments: number;
  totalOnLeaveStaff: number;
  totalTeachingStaff: number;
  totalPendingLeaves: number;
  avgWorkHoursChange: number;
  attendanceRateChange: number;
  totalPresentLateToday: number;
  totalNonTeachingStaff: number;
};

// Auth DTOs
export type TLoginRequest = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    staff?: TStaff;
  };
};

export type TRegisterRequest = {
  email: string;
  password: string;
  staffId?: string;
};

export type TRegisterResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};
