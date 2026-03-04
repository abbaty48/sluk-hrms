export type TUserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
// Entity Interfaces
export type TUser = {
    id: string;
    email: string;
    passwordHash: string;
    role: TUserRole;
    staffId: string | null;
    createdAt: string;
    updatedAt: string;
}
