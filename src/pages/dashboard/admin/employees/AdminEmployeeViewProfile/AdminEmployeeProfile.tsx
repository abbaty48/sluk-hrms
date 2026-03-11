import {
    formatPhoneNumber,
    getStaffStatusLabel,
    getStaffStatusVariant,
} from "@/lib/utils";
import {
    Mail,
    Hash,
    Flag,
    Save,
    Phone,
    Pencil,
    Building,
    Calendar,
    Briefcase,
    ArrowLeft,
} from "lucide-react";
import { AEVPDateInfoItem, AEVPDepartmentInfoItem, AEVPEmptyEmployee, AEVPInfoItem, AEVPRankInfoItem } from "./AdminEmployeeProfilePageComponents";
import { useStaffProfile, useUpdateStaffProfileAPI } from "@/hooks/api/useAdminStaffApi";
import type { TStaffDetails, TStaffProfileUpdateRequest } from "@/types/staffTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AEPDialog } from "./AdminEmployeeProfilePageDialog";
import { Separator } from "@/components/ui/separator";
import { Activity, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Motion } from "@/components/Motion";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TPageProps = {
    handleEdit?: () => void;
    handleBack: () => void;
    staffId?: string;
}

/**
 *
 */
function EmployeeProfile({ employee, handleBack }: { employee: TStaffDetails, handleBack: () => void }) {

    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null)
    const [openChangeStatus, setOpenChangeStatus] = useState(false)
    const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateStaffProfileAPI();
    const { handleSubmit, ...formHook } = useForm<TStaffProfileUpdateRequest>({
        defaultValues: {
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            rankId: employee.rankId,
            departmentId: employee.departmentId,
            joinOn: employee.dateOfFirstAppointment || new Date().toDateString()
        }
    })

    const handleSaveEdit = async () => {

        if (await formHook.trigger()) {
            try {
                await updateProfile({
                    staffId: employee.id,
                    ...formHook.getValues()
                });
                toast.success('Update successful', { description: 'Employee detail successful updated.' });
                setIsEditing(false);
            } catch (error: any) {
                toast.error('Update Failed ', { description: error.message || 'Failed to update employee profile.' })
            }
        }
    }

    const getEmployeeInitials = `${employee?.name?.split("")[0]?.toLocaleUpperCase()}${employee?.name?.split("")[1]?.toLocaleUpperCase()}`

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" disabled={isUpdating} onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                    <h1 className="page-title">Employee Profile</h1>
                    <p className="page-subtitle">{employee.id}</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* FOR VIEW MODE ONLY */}
                    <Activity mode={!isEditing ? 'visible' : 'hidden'}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpenChangeStatus(true)}
                        >
                            <Flag className="h-4 w-4 mr-1" />
                            Status
                        </Button>

                        <Button size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </Activity>
                    {/* FOR EDIT NODE */}
                    <Activity mode={isEditing ? 'visible' : 'hidden'}>
                        <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>

                        <Button size="sm" disabled={isUpdating} onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-1" />
                            Save Edit
                        </Button>
                    </Activity>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Motion variant="scale" delay={0.1}>
                    <Card className="flex flex-col items-center text-center py-8 gap-4">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={employee.profilePhoto} alt={employee.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                {getEmployeeInitials}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name & Position */}
                        <>
                            <h2 className="text-xl font-semibold text-card-foreground">
                                {employee.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">{employee.rank}</p>
                        </>

                        {/* Status Badge */}
                        <Badge
                            className="status-badge"
                            variant={getStaffStatusVariant(employee.status) as any}
                        >
                            {getStaffStatusLabel(employee.status)}
                        </Badge>

                        <Separator />

                        {/* Contact Buttons */}
                        <Activity mode={isEditing ? "hidden" : "visible"}>
                            <div className="flex gap-3 w-full justify-center">
                                <a href={`mailto:${employee.email}`}>
                                    <Button variant="outline" size="sm">
                                        <Mail className="h-4 w-4 mr-1" />
                                        Email
                                    </Button>
                                </a>

                                <a href={`tel:${employee.phone}`}>
                                    <Button variant="outline" size="sm">
                                        <Phone className="h-4 w-4 mr-1" />
                                        Call
                                    </Button>
                                </a>
                            </div>
                        </Activity>
                    </Card>
                </Motion>

                {/* Information Cards */}
                <form ref={formRef} onSubmit={handleSubmit(handleSaveEdit)} className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Motion variant="fadeUp" delay={0.2}>
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold text-card-foreground mb-2">
                                Personal Information
                            </h3>

                            <fieldset disabled={isUpdating} className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                <AEVPInfoItem
                                    name=""
                                    icon={Hash}
                                    label="Employee ID"
                                    value={employee.id}
                                />

                                <AEVPInfoItem
                                    name="name"
                                    isRequired
                                    icon={Briefcase}
                                    label="Full Name"
                                    formHook={formHook}
                                    value={employee.name}
                                    isEditing={isEditing}
                                    requiredMessage="Staff name must be provided, but omitted."

                                />

                                <AEVPInfoItem
                                    icon={Mail}
                                    isRequired
                                    name="email"
                                    label="Email Address"
                                    formHook={formHook}
                                    value={employee.email}
                                    isEditing={isEditing}
                                    requiredMessage="Staff email must be provided, but omitted."
                                />

                                <AEVPInfoItem
                                    icon={Phone}
                                    name="phone"
                                    isRequired
                                    label="Phone Number"
                                    formHook={formHook}
                                    isEditing={isEditing}
                                    value={formatPhoneNumber(employee.phone || 'N/A')}
                                    requiredMessage="Staff phone number must be provided, but omitted."
                                />
                            </fieldset>
                        </Card>
                    </Motion>

                    {/* Work Information */}
                    <Motion variant="fadeUp" delay={0.3}>
                        <Card className="p-4">
                            <h3 className="text-sm font-semibold text-card-foreground mb-2">
                                Work Information
                            </h3>

                            <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-1" disabled={isUpdating}>
                                <AEVPDepartmentInfoItem
                                    isRequired
                                    icon={Building}
                                    name="department"
                                    isEditing={isEditing}
                                    value={employee.department?.id || "N/A"}
                                    label={employee.department?.name || "N/A"}
                                />

                                <AEVPRankInfoItem
                                    name="rank"
                                    isRequired
                                    icon={Briefcase}
                                    isEditing={isEditing}
                                    label={employee.rank}
                                    value={employee.rankId}
                                />

                                <AEVPInfoItem
                                    icon={Flag}
                                    name="status"
                                    label="Status"
                                    value={getStaffStatusLabel(employee.status)}
                                />

                                <AEVPDateInfoItem
                                    name="joinOn"
                                    icon={Calendar}
                                    label="Join Date"
                                    isEditing={isEditing}
                                    value={employee.dateOfFirstAppointment!}
                                />
                            </fieldset>
                        </Card>
                    </Motion>
                </form>
            </div>

            {/* Change Status Dialog */}
            <AEPDialog employeeId={employee.id} employeeName={employee.name} employeeStatus={employee.status}
                openChangeStatus={openChangeStatus} setOpenChangeStatus={setOpenChangeStatus} />
        </>
    )
}


/**
 *
 */
export function AdminEmployeeProfile({ staffId, handleBack }: TPageProps) {

    const { data: employee } = useStaffProfile(staffId!);

    return (
        <Motion variant="fadeUp" className="space-y-6 p-4">
            {!employee ? <AEVPEmptyEmployee handleBack={handleBack} /> :
                <EmployeeProfile employee={employee} handleBack={handleBack} />}
        </Motion>
    );
}
