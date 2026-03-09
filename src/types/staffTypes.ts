import type { TLeaveBalance, TLeaveResponse } from "./leave-managementTypes";
import type { TAttendance } from "./attendance.types";
import type { TDepartment } from "./departmentTypes";
import type { TUser } from "./userTypes";
import type { TRank } from "./rankTypes";

export type TStaffWithDepartmentName = TStaff & { department: { name: string } };
export type TStaffCategory = "Senior" | "Junior";
export type TGender = "Male" | "Female";

export type TStaffStatus =
    | "Employed"
    | "On Leave"
    | "Retired"
    | "Terminated"
    | "Resigned";


export type TCadre =
    | "Teaching"
    | "Technical"
    | "Non-Teaching"
    | "Administrative";


export interface TStaff {
    id: string;
    staffNo: string;
    name: string;
    email: string;
    phone: string | null;
    dateOfBirth: string | null;
    gender: TGender | null;
    address: string | null;
    city: string | null;
    state: string | null;
    lga: string | null;
    departmentId: string;
    rankId: string;
    rank: string;
    cadre: TCadre;
    staffCategory: TStaffCategory;
    maritalStatus: string;
    religion: string;
    profilePhoto?: string;
    natureOfAppointment: string | null;
    conuassContiss: string | null;
    dateOfFirstAppointment: string | null;
    dateOfLastPromotion: string | null;
    status: TStaffStatus;
    createdAt: string;
    updatedAt: string;
}

export type TStaffPerDepartment = {
    departmentName: string;
    staffCount: number;
    teachingStaff: number;
    nonTeachingStaff: number;
}

export type TStaffDetails = TStaff & {
    department?: TDepartment;
    rankDetails?: TRank;
    user?: TUser;
}

export type TEnrichedStaff = TStaff & {
    department?: TDepartment;
    rankDetails?: TRank;
}

// Statistics DTOs
export type TStaffStatistics = {
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
export type TStaffFormData = {
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

export type TStaffStats = {
    staffId: string;
    name: string;
    department: string | null;
    rank: string;
    leaveBalance: {
        totalAllowed: number,
        totalUsed: number,
        totalRemaining: number,
        breakdown: TLeaveBalance,
    };
    attendance: TAttendance;
    leavePercent: number;
    salary: {
        netSalary: number;
        month: number;
        status: string;
    };
    recentLeaves: TLeaveResponse[];
}


export interface TStaffUpdateStatusRequest {
    staffId: string;
    status: TStaffStatus;
}

export interface TStaffUpdateStatusResponse {
    success: boolean;
    message: string;
    staff: TStaffDetails;
}

// Helper function to get initials
