import type { Request } from "express";

// Enums
export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type Gender = "Male" | "Female";
export type StaffCategory = "Senior" | "Junior";
export type Cadre =
  | "Teaching"
  | "Non-Teaching"
  | "Administrative"
  | "Technical";
export type StaffStatus =
  | "Employed"
  | "On Leave"
  | "Retired"
  | "Terminated"
  | "Resigned";
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LATE"
  | "ON_LEAVE"
  | "WEEKEND"
  | "HOLIDAY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Entity Interfaces
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  staffId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  staffNo: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  state: string | null;
  lga: string | null;
  departmentId: string;
  rankId: string;
  rank: string;
  cadre: Cadre;
  staffCategory: StaffCategory;
  natureOfAppointment: string | null;
  conuassContiss: string | null;
  dateOfFirstAppointment: string | null;
  dateOfLastPromotion: string | null;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  headId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Rank {
  id: string;
  title: string;
  level: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: number | null;
  status: AttendanceStatus;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface Leave {
  id: string;
  staffId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approverId: string | null;
  approverComments: string | null;
  appliedAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  id: string;
  staffId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  grossSalary: number;
  netSalary: number;
  status: string;
  processedBy: string | null;
  processedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
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

export interface Announcement {
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
export interface Database {
  users: User[];
  staff: Staff[];
  departments: Department[];
  ranks: Rank[];
  attendance: Attendance[];
  leaves: Leave[];
  leaveTypes: LeaveType[];
  payrolls: Payroll[];
  documents: Document[];
  announcements: Announcement[];
}

// Request Interfaces
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    staffId: string;
  };
}

// Response DTOs
export interface DashboardStats {
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

export interface StaffPerDepartment {
  departmentName: string;
  staffCount: number;
  teachingStaff: number;
  nonTeachingStaff: number;
}

export interface MonthlyAttendanceTrend {
  month: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  attendanceRate: number;
}
export type LeavePending = Leave & {
  staff: Partial<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  leaveType?: string;
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

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  avgWorkHours: string;
}

export interface LeaveBalance {
  leaveType: string;
  allowed: number;
  used: number;
  remaining: number;
}

export interface DepartmentSummary {
  departmentId: string;
  departmentName: string;
  staffCount: number;
  teachingStaff: number;
  nonTeachingStaff: number;
  seniorStaff: number;
  juniorStaff: number;
}

export interface StaffDetails extends Staff {
  department?: Department;
  rankDetails?: Rank;
  user?: User;
}

export interface EnrichedStaff extends Staff {
  department?: Department;
  rankDetails?: Rank;
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    staff?: Staff;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  staffId?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Statistics DTOs
export interface StaffStatistics {
  byDepartment: {
    departmentName: string;
    count: number;
  }[];
  byRank: {
    rank: string;
    count: number;
  }[];
  byCadre: {
    cadre: string;
    count: number;
  }[];
  byState: {
    state: string;
    count: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
}

/* STAFF FORM DATA */
export type StaffFormData = {
  // Personal Details
  personalStaffNumber: string; //staffNo
  personalStaffName: string; //name
  personalStaffCategory: string; //staffCategory
  personalGender: string; //gender
  personalMaritalStatus: string; // -- MISSING
  personalDateOfBirth: string; //dateOfBirth
  personalPhone: string; //phone
  personalEmail: string; //email
  personalPlaceOfBirth: string; //address
  personalNationality: string; // -- MISSING
  personalState: string; //state
  personalLocalGovernment: string; //lga
  personalReligion: string; // -- MISSING

  // Appointment Details
  appointmentCadre: string; //cadre
  appointmentRank: string; //rank
  appointmentNature: string; //natureOfAppointment
  appointmentDateFirst: string; //dateOfFirstAppointment
  appointmentDatePresent: string; // dateOfLastPromotion
  appointmentUnitDepartment: string; //departmentId

  // Location Details
  locationTown: string; // -- MISSING
  locationCountry: string; // -- MISSING
  locationStaffStatus: string; //status
  locationStaffStatusComment?: string; // -- MISSING
  locationPermanentAddress: string; // -- MISSING
};
