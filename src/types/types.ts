import type { Request } from "express";

// Enums
export type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type EmployeeType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
export type EmploymentStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "RESIGNED"
  | "TERMINATED"
  | "RETIRED";
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LATE"
  | "ON_LEAVE"
  | "WEEKEND"
  | "HOLIDAY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type PayrollStatus = "DRAFT" | "PROCESSED" | "PAID" | "ON_HOLD";
export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED"
  | "REJECTED";
export type ReviewType = "SELF" | "MANAGER" | "PEER" | "SUBORDINATE";

// Entity Interfaces
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  departmentId: string;
  designationId: string;
  employeeType: EmployeeType;
  joiningDate: string;
  confirmationDate: string | null;
  resignationDate: string | null;
  lastWorkingDay: string | null;
  status: EmploymentStatus;
  currentSalary: number | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  managerId: string | null;
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

export interface Designation {
  id: string;
  title: string;
  level: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  id: string;
  employeeId: string;
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
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  grossSalary: number;
  netSalary: number;
  status: PayrollStatus;
  processedBy: string | null;
  processedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  departmentId: string;
  description: string;
  requirements: string;
  location: string;
  employmentType: EmployeeType;
  salaryRange: string | null;
  status: string;
  postedBy: string;
  closingDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobPostingId: string;
  candidateName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  currentStage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  interviewerId: string;
  mode: string;
  status: string;
  feedback: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: string;
  reviewType: ReviewType;
  goals: Goal[];
  ratings: Record<string, number>;
  overallRating: number;
  strengths: string | null;
  areasOfImprovement: string | null;
  comments: string | null;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  status: string;
  progress: number;
}

export interface Document {
  id: string;
  employeeId: string;
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
  __wrapped__: Database;
  users: User[];
  employees: Employee[];
  departments: Department[];
  designations: Designation[];
  attendance: Attendance[];
  leaves: Leave[];
  leaveTypes: LeaveType[];
  payrolls: Payroll[];
  jobPostings: JobPosting[];
  applications: Application[];
  interviews: Interview[];
  performanceReviews: PerformanceReview[];
  documents: Document[];
  announcements: Announcement[];
}

// Request Interfaces
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    employeeId: string;
  };
}

// Response DTOs
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  attendanceRate: string;
  pendingActions: number;
  lateArrivals: number;
  avgWorkHours: number;
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

export interface DepartmentPayrollSummary {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
}

export interface RecruitmentPipeline {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  offered: number;
  hired: number;
  rejected: number;
}

export interface PerformanceSummary {
  totalReviews: number;
  averageRating: string;
  submitted: number;
  draft: number;
  topPerformers: TopPerformer[];
}

export interface TopPerformer {
  employeeId: string;
  rating: number;
  period: string;
}

export interface EmployeeDetails extends Employee {
  department?: Department;
  designation?: Designation;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface EnrichedEmployee extends Employee {
  department?: Department;
  designation?: Designation;
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
    employee?: Employee;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  employeeId?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
