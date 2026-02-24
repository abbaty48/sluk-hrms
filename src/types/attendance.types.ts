import type { TPagination } from "./types";

// types/attendance.types.ts
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE" | "HALF_DAY";

// Represent the data's in the database.
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

export type AttendanceStats = {
  presentToday: number;
  lateArrivals: number;
  onLeave: number;
  absent: number;
};

export type AttendanceWeeklyChart = {
  weekData: {
    day: string,
    date: string,
    late: number,
    total: number,
    absent: number,
    onLeave: number,
    halfDay: number,
    present: number,
    attendanceRate: number,
  }[],
  summary: {
    totalOnLeave: number,
    totalPresent: number,
    totalAbsent: number,
    totalLate: number,
    weekStart: string,
    weekEnd: string,
  }
}

export type AttendanceResponse = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  checkIn: string | null;
  checkOut?: string | null;
  status: AttendanceStatus;
  date: string;
  notes?: string;
};

export type AttendanceResponseList = {
  data: AttendanceResponse[],
  pagination: TPagination
}


export type AttendanceFilters = {
  department?: string;
  status?: AttendanceStatus | "all";
  date?: string;
  search?: string;
};

export type AttendanceSummary = {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  onLeaveCount: number;
  attendanceRate: number;
};

export type CheckInRequest = {
  employeeId: string;
  checkInTime: string;
  location?: string;
  notes?: string;
};

export type CheckOutRequest = {
  employeeId: string;
  checkOutTime: string;
  notes?: string;
};

export type AttendanceReport = {
  startDate: string;
  endDate: string;
  department?: string;
  data: AttendanceResponse[];
  summary: AttendanceSummary;
};
