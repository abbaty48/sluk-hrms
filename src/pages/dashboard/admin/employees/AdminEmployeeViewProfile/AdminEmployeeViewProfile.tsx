import {
    formatPhoneNumber,
    getStaffStatusLabel,
    getStaffStatusVariant,
} from "@/lib/utils";
import {
    Mail,
    Hash,
    Flag,
    Phone,
    Pencil,
    Building,
    Calendar,
    Briefcase,
    ArrowLeft,
} from "lucide-react";
import { useStaffProfile, useStaffUpdateStaffStatus } from "@/hooks/api/useAdminStaffApi";
import { AEVPEmptyEmployee, AEVPInfoItem } from "./AdminEmployeeViewProfilePageComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Motion } from "@/components/Motion";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";

type TPageProps = {
    handleEdit?: () => void;
    handleBack: () => void;
    staffId?: string;
}

export function AdminEmployeeViewProfile({ staffId, handleBack, handleEdit }: TPageProps) {

    const { data: employee } = useStaffProfile(staffId!);
    const updateStatus = useStaffUpdateStaffStatus();

    const handleStatusChange = () => {
        if (!employee) return;

        updateStatus.mutate(
            {
                staffId: employee.id,
                status: "Terminated",
            },
            {
                onSuccess: () => {
                    toast.success(`Employee status updated to `);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to update status");
                },
            }
        );
    };

    const getEmployeeInitials = `${employee?.name.split("")[0].toLocaleUpperCase()}${employee?.name.split("")[1]?.toLocaleUpperCase()}`

    return (
        <Motion variant="fadeUp" className="space-y-6 p-4">
            {!employee ? <AEVPEmptyEmployee handleBack={handleBack} /> : (
                <>
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className="flex-1">
                            <h1 className="page-title">Employee Profile</h1>
                            <p className="page-subtitle">{employee.id}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleStatusChange}
                                disabled={updateStatus.isPending}
                            >
                                <Flag className="h-4 w-4 mr-1" />
                                Status
                            </Button>

                            <Button size="sm" onClick={handleEdit}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
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
                                <div>
                                    <h2 className="text-xl font-semibold text-card-foreground">
                                        {employee.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">{employee.rank}</p>
                                </div>

                                {/* Status Badge */}
                                <Badge
                                    className="status-badge"
                                    variant={getStaffStatusVariant(employee.status) as any}
                                >
                                    {getStaffStatusLabel(employee.status)}
                                </Badge>

                                <Separator />

                                {/* Contact Buttons */}
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
                            </Card>
                        </Motion>

                        {/* Information Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Motion variant="fadeUp" delay={0.2}>
                                <Card className="p-4">
                                    <h3 className="text-sm font-semibold text-card-foreground mb-2">
                                        Personal Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                        <AEVPInfoItem
                                            icon={Hash}
                                            label="Employee ID"
                                            value={employee.id}
                                        />

                                        <AEVPInfoItem
                                            icon={Briefcase}
                                            label="Full Name"
                                            value={employee.name}
                                        />

                                        <AEVPInfoItem
                                            icon={Mail}
                                            label="Email Address"
                                            value={employee.email}
                                        />

                                        <AEVPInfoItem
                                            icon={Phone}
                                            label="Phone Number"
                                            value={formatPhoneNumber(employee.phone || 'N/A')}
                                        />
                                    </div>
                                </Card>
                            </Motion>

                            {/* Work Information */}
                            <Motion variant="fadeUp" delay={0.3}>
                                <Card className="p-4">
                                    <h3 className="text-sm font-semibold text-card-foreground mb-2">
                                        Work Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                        <AEVPInfoItem
                                            icon={Building}
                                            label="Department"
                                            value={employee.department?.name || "N/A"}
                                        />

                                        <AEVPInfoItem
                                            icon={Briefcase}
                                            label="Role / Position"
                                            value={employee.rank}
                                        />

                                        <AEVPInfoItem
                                            icon={Flag}
                                            label="Status"
                                            value={getStaffStatusLabel(employee.status)}
                                        />

                                        <AEVPInfoItem
                                            icon={Calendar}
                                            label="Join Date"
                                            value={format(new Date(employee.createdAt), "d MMMM yyyy")}
                                        />
                                    </div>
                                </Card>
                            </Motion>
                        </div>
                    </div>
                </>
            )
            }
        </Motion>
    );
}
